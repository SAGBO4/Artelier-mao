<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import TweaksPanel from '@/components/tweaks/TweaksPanel.vue'
import { useProjectsStore } from '@/stores/projects'
import { useTeamStore } from '@/stores/team'
import { useShowreelStore } from '@/stores/showreel'
import { useSettingsStore } from '@/stores/settings'
import { useMessagesStore } from '@/stores/messages'
import { STUDIO } from '@/data/studio'

const router = useRouter()
const me = ref(null)
const activeTab = ref('projets')
const saving = ref(false)
const error = ref('')

const projectsStore = useProjectsStore()
const teamStore = useTeamStore()
const showreelStore = useShowreelStore()
const settingsStore = useSettingsStore()
const messagesStore = useMessagesStore()

const projectsCount = computed(() => projectsStore.projects.length)
const unreadCount = computed(() => messagesStore.messages.filter(m => !m.is_read).length)

const projects = computed(() => projectsStore.projects)
const team = computed(() => teamStore.members)
const showreel = computed(() => showreelStore.items)
const settings = computed(() => settingsStore.settings)
const messages = computed(() => messagesStore.messages)

const selectedMessage = ref(null)

const loading = computed(() => projectsStore.loading || teamStore.loading || showreelStore.loading || settingsStore.loading || messagesStore.loading)

// FORMULAIRES (Libellés simplifiés pour non-devs)
const projectForm = ref({
  title: '', year: '2025', type: 'Identité', chapter: 'identite', ratio: '4/5', tone: 'warm', image_url: ''
})
const memberForm = ref({
  name: '', role: '', bio: '', skills: '', image_url: '', tone: 'warm', sort_order: 0
})
const showreelForm = ref({
  label: '', image_url: '', column_id: 1, tone: 'warm', sort_order: 0
})

const chapters = [
  { id: 'identite', label: 'Identité' },
  { id: 'espace', label: 'Espace' },
  { id: 'digital', label: 'Digital' },
  { id: 'evenement', label: 'Événement' }
]
const tones = [
  { id: 'warm', label: 'Chaud (Beige)' },
  { id: 'cool', label: 'Frais (Bleuté)' },
  { id: 'neutral', label: 'Neutre (Gris)' },
  { id: 'ink', label: 'Encre (Noir)' }
]

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  if (!data.user) router.replace({ name: 'admin-login' })
  me.value = data.user
  refreshAll()
})

async function refreshAll() {
  projectsStore.fetchProjects()
  teamStore.fetchTeam()
  showreelStore.fetchShowreel()
  settingsStore.fetchSettings()
  messagesStore.fetchMessages()
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
}

async function viewMessage(m) {
  selectedMessage.value = m
  if (!m.is_read) {
    await messagesStore.markAsRead(m.id)
  }
}

async function onPickFile(e, targetForm) {
  const file = e.target.files?.[0]
  if (!file) return
  
  // Validation de base (Audit Sécurité)
  const MAX_SIZE = 5 * 1024 * 1024 // 5Mo
  if (file.size > MAX_SIZE) {
    error.value = "L'image est trop lourde (max 5 Mo)."
    return
  }

  saving.value = true
  error.value = ''
  
  try {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `uploads/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`
    
    const { error: upErr } = await supabase.storage.from('site').upload(path, file, {
      contentType: file.type,
      upsert: true
    })
    
    if (upErr) throw upErr
    
    const { data } = supabase.storage.from('site').getPublicUrl(path)
    targetForm.image_url = data.publicUrl
  } catch (e2) {
    // console.error(e2) // Pour le debug si besoin
    error.value = "Erreur lors de l'envoi : " + (e2.message || e2.error_description || "Vérifiez votre connexion ou le bucket.")
  } finally {
    saving.value = false
    e.target.value = ''
  }
}


async function handleAction(table, action, data = null, id = null) {
  error.value = ''
  saving.value = true
  try {
    let res
    if (action === 'add') {
      res = await supabase.from(table).insert([data])
    } else if (action === 'delete') {
      if (!confirm('Supprimer définitivement ?')) return
      res = await supabase.from(table).delete().eq('id', id)
    }
    if (res.error) throw res.error
    await refreshAll()
    // Reset forms
    if (table === 'projects') projectForm.value = { title: '', year: '2025', type: 'Identité', chapter: 'identite', ratio: '4/5', tone: 'warm', image_url: '' }
    if (table === 'team_members') memberForm.value = { name: '', role: '', bio: '', skills: '', image_url: '', tone: 'warm', sort_order: 0 }
    if (table === 'showreel_items') showreelForm.value = { label: '', image_url: '', column_id: 1, tone: 'warm', sort_order: 0 }
  } catch (e) {
    error.value = "Une erreur est survenue."
  } finally {
    saving.value = false
  }
}

async function saveSettings() {
  error.value = ''
  saving.value = true
  try {
    const toUpsert = Object.entries(settings.value).map(([id, value]) => ({ id, value }))
    const { error: err } = await supabase.from('site_settings').upsert(toUpsert)
    if (err) throw err
    await refreshAll()
    alert('Informations du studio mises à jour !')
  } catch (e) {
    error.value = "Erreur lors de la sauvegarde des paramètres."
  } finally {
    saving.value = false
  }
}


async function logout() {
  await supabase.auth.signOut()
  router.replace({ name: 'admin-login' })
}
</script>

<template>
  <main class="page admin-page">
    <header class="admin-header">
      <div class="admin-brand">
        <h1 class="admin-title">L'atelier — <em>Dashboard</em></h1>
        <p class="admin-user">{{ me?.email }}</p>
      </div>
      <button class="btn-logout" @click="logout">Quitter</button>
    </header>

    <nav class="admin-tabs">
      <button v-for="tab in [{id:'projets', l:'Nos Pièces'}, {id:'equipe', l:'L\'Équipe'}, {id:'showreel', l:'Showreel'}, {id:'messages', l:'Messages'}, {id:'settings', l:'Infos Studio'}]" 
        :key="tab.id" :class="['tab-btn', {active: activeTab === tab.id}]" @click="activeTab = tab.id">
        {{ tab.l }}
        <span v-if="tab.id === 'messages' && unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </button>
    </nav>

    <p v-if="error" class="admin-error">{{ error }}</p>

    <!-- PROJETS -->
    <section v-if="activeTab === 'projets'" class="admin-section">
      <div class="section-top">
        <h2 class="sect-label">Ajouter une nouvelle pièce au portfolio</h2>
      </div>
      
      <div class="admin-form-box">
        <div class="form-grid">
          <label class="field"><span class="field-label">Titre du projet</span><input v-model="projectForm.title" placeholder="Ex: Fresque Murale Dantokpa" /></label>
          <label class="field"><span class="field-label">Année</span><input v-model="projectForm.year" placeholder="2025" /></label>
          <label class="field"><span class="field-label">Type de travail</span><input v-model="projectForm.type" placeholder="Ex: Peinture / Digital" /></label>
          <label class="field"><span class="field-label">Catégorie</span>
            <select v-model="projectForm.chapter"><option v-for="c in chapters" :key="c.id" :value="c.id">{{ c.label }}</option></select>
          </label>
          <label class="field field-full">
            <span class="field-label">Image (JPEG ou PNG)</span>
            <div class="upload-zone-wrapper">
              <div class="upload-zone">
                <input type="file" @change="e => onPickFile(e, projectForm)" accept="image/*" :disabled="saving" />
                <span v-if="saving" class="upload-loading">⌛ Envoi en cours...</span>
                <span v-else-if="projectForm.image_url" class="upload-success">✓ Image prête</span>
              </div>
              <p class="field-hint">Format recommandé : Portrait 4:5</p>
              <div v-if="projectForm.image_url" class="form-image-preview" :style="{ backgroundImage: `url(${projectForm.image_url})` }"></div>
            </div>
          </label>
        </div>
        <button class="btn-submit" @click="handleAction('projects', 'add', projectForm)" :disabled="saving || !projectForm.title">
          Enregistrer dans le portfolio
        </button>
      </div>

      <div class="admin-list">
        <div v-for="p in projects" :key="p.id" class="list-item">
          <div class="item-preview" :style="{ backgroundImage: `url(${p.image_url})` }"></div>
          <div class="item-info">
            <span class="item-name">{{ p.title }}</span>
            <span class="item-sub">{{ p.year }} · {{ p.type }}</span>
          </div>
          <button class="btn-del" @click="handleAction('projects', 'delete', null, p.id)">Supprimer</button>
        </div>
        <p v-if="!projects.length" class="empty-msg">Aucun projet personnalisé. Le site utilise les exemples par défaut.</p>
      </div>
    </section>

    <!-- ÉQUIPE -->
    <section v-if="activeTab === 'equipe'" class="admin-section">
      <div class="section-top"><h2 class="sect-label">Ajouter un nouveau membre</h2></div>
      <div class="admin-form-box">
        <div class="form-grid">
          <label class="field"><span class="field-label">Nom complet</span><input v-model="memberForm.name" /></label>
          <label class="field"><span class="field-label">Poste / Rôle</span><input v-model="memberForm.role" /></label>
          <label class="field field-full"><span class="field-label">Bio (Quelques mots)</span><textarea v-model="memberForm.bio" rows="3"></textarea></label>
          <label class="field"><span class="field-label">Compétences (ex: Design, Peinture, Code)</span><input v-model="memberForm.skills" /></label>
          <label class="field"><span class="field-label">Ambiance couleur</span>
            <select v-model="memberForm.tone"><option v-for="t in tones" :key="t.id" :value="t.id">{{ t.label }}</option></select>
          </label>
          <label class="field field-full">
            <span class="field-label">Portrait</span>
            <div class="upload-zone-wrapper">
              <div class="upload-zone">
                <input type="file" @change="e => onPickFile(e, memberForm)" accept="image/*" :disabled="saving" />
                <span v-if="saving" class="upload-loading">⌛ Envoi en cours...</span>
                <span v-else-if="memberForm.image_url" class="upload-success">✓ Image prête</span>
              </div>
              <p class="field-hint">Format recommandé : Carré 1:1</p>
              <div v-if="memberForm.image_url" class="form-image-preview circle" :style="{ backgroundImage: `url(${memberForm.image_url})` }"></div>
            </div>
          </label>
        </div>
        <button class="btn-submit" @click="handleAction('team_members', 'add', { ...memberForm, skills: (memberForm.skills || '').split(',').map(s=>s.trim()) })" :disabled="saving || !memberForm.name">
          Ajouter à l'équipe
        </button>
      </div>
      <div class="admin-list">
        <div v-for="m in team" :key="m.id" class="list-item">
          <div class="item-preview circle" :style="{ backgroundImage: `url(${m.image_url})` }"></div>
          <div class="item-info"><span class="item-name">{{ m.name }}</span><span class="item-sub">{{ m.role }}</span></div>
          <button class="btn-del" @click="handleAction('team_members', 'delete', null, m.id)">Retirer</button>
        </div>
      </div>
    </section>

    <!-- SHOWREEL -->
    <section v-if="activeTab === 'showreel'" class="admin-section">
      <div class="section-top"><h2 class="sect-label">Images qui défilent en accueil</h2></div>
      <div class="admin-form-box">
        <div class="form-grid">
          <label class="field"><span class="field-label">Légende (apparaît au survol)</span><input v-model="showreelForm.label" /></label>
          <label class="field"><span class="field-label">Emplacement exact sur l'accueil</span>
            <select v-model="showreelForm.column_id">
              <option :value="1">À droite de "L'atelier — Studio Créatif"</option>
              <option :value="2">Milieu (défilement central)</option>
              <option :value="3">Bord droit (vers "03 Récemment au studio")</option>
            </select>
          </label>
          <label class="field field-full">
            <span class="field-label">Fichier Image</span>
            <div class="upload-zone-wrapper">
              <div class="upload-zone">
                <input type="file" @change="e => onPickFile(e, showreelForm)" accept="image/*" :disabled="saving" />
                <span v-if="saving" class="upload-loading">⌛ Envoi en cours...</span>
                <span v-else-if="showreelForm.image_url" class="upload-success">✓ Image prête</span>
              </div>
              <p class="field-hint">Format recommandé : Portrait 3:4</p>
              <div v-if="showreelForm.image_url" class="form-image-preview" :style="{ backgroundImage: `url(${showreelForm.image_url})` }"></div>
            </div>
          </label>
        </div>
        <button class="btn-submit" @click="handleAction('showreel_items', 'add', showreelForm)" :disabled="saving || !showreelForm.image_url">
          Ajouter au visuel d'accueil
        </button>
      </div>
      <div class="admin-list">
        <div v-for="s in showreel" :key="s.id" class="list-item">
          <div class="item-preview" :style="{ backgroundImage: `url(${s.image_url})` }"></div>
          <div class="item-info">
            <span class="item-name">{{ s.label }}</span>
            <span class="item-sub">
              {{ s.column_id === 1 ? 'Près du texte d\'accueil' : s.column_id === 2 ? 'Milieu' : 'Bord droit' }}
            </span>
          </div>
          <button class="btn-del" @click="handleAction('showreel_items', 'delete', null, s.id)">Supprimer</button>
        </div>
      </div>
    </section>

    <!-- MESSAGES (Contact) -->
    <section v-if="activeTab === 'messages'" class="admin-section">
      <div class="section-top"><h2 class="sect-label">Demandes de contact reçues</h2></div>
      
      <div class="msg-layout">
        <!-- Liste des messages -->
        <div class="admin-list msg-list">
          <div v-for="m in messages" :key="m.id" 
            :class="['list-item msg-item', { active: selectedMessage?.id === m.id, unread: !m.is_read }]"
            @click="viewMessage(m)">
            <div class="item-info">
              <div class="msg-header">
                <span class="item-name">{{ m.name }}</span>
                <span class="msg-date">{{ formatDate(m.created_at) }}</span>
              </div>
              <span class="item-sub text-truncate">{{ m.subject || '(Sans sujet)' }}</span>
            </div>
            <button class="btn-del-icon" title="Supprimer" @click.stop="messagesStore.deleteMessage(m.id)">✕</button>
          </div>
          <p v-if="!messages.length" class="empty-msg">Aucun message pour le moment.</p>
        </div>

        <!-- Détail du message -->
        <div class="msg-detail">
          <div v-if="selectedMessage" class="msg-detail-inner card-fade">
            <div class="detail-header">
              <h3 class="detail-name">{{ selectedMessage.name }}</h3>
              <p class="detail-meta">
                <span>{{ selectedMessage.email }}</span>
                <span class="dot">·</span>
                <span>{{ formatDate(selectedMessage.created_at) }}</span>
              </p>
            </div>
            <div class="detail-body">
              <p v-if="selectedMessage.subject" class="detail-subject"><strong>Sujet:</strong> {{ selectedMessage.subject }}</p>
              <div class="detail-content">{{ selectedMessage.message }}</div>
            </div>
            <div class="detail-foot">
              <a :href="`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Votre demande'}`" class="btn-submit">
                Répondre par email
              </a>
            </div>
          </div>
          <div v-else class="msg-placeholder">
            <p>Sélectionnez un message pour en lire le contenu.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SETTINGS -->
    <section v-if="activeTab === 'settings'" class="admin-section">
      <div class="section-top"><h2 class="sect-label">Informations générales du studio</h2></div>
      <div class="admin-form-box">
        <div class="form-grid">
          <label class="field"><span class="field-label">Nom du studio</span><input v-model="settings.name" /></label>
          <label class="field"><span class="field-label">Nom long / Slogan</span><input v-model="settings.long" /></label>
          <label class="field field-full"><span class="field-label">Tagline (Accueil)</span><input v-model="settings.tagline" /></label>
          <label class="field"><span class="field-label">Email de contact</span><input v-model="settings.email" /></label>
          <label class="field"><span class="field-label">Téléphone</span><input v-model="settings.phone" /></label>
          <label class="field"><span class="field-label">Ville / Adresse</span><input v-model="settings.city" /></label>
          <label class="field"><span class="field-label">Année de fondation</span><input v-model="settings.founded" /></label>
          
          <div class="field-full" style="margin-top: 20px; border-top: 1px solid var(--ink-08); pt: 20px;">
            <p class="field-label" style="margin-bottom: 16px;">Réseaux Sociaux (Handles ou URLs)</p>
            <div class="form-grid" style="margin-bottom: 0;">
              <label class="field"><span class="field-label">Instagram</span><input v-model="settings.instagram" placeholder="@user" /></label>
              <label class="field"><span class="field-label">Facebook</span><input v-model="settings.facebook" placeholder="/user" /></label>
              <label class="field"><span class="field-label">LinkedIn</span><input v-model="settings.linkedin" placeholder="/user" /></label>
            </div>
          </div>
        </div>
        <button class="btn-submit" @click="saveSettings" :disabled="saving">
          Enregistrer les informations du studio
        </button>
      </div>
      
      <div class="info-note">
        <p>Ces informations sont utilisées sur les pages <strong>Contact</strong>, <strong>Équipe</strong> et dans le <strong>Pied de page</strong> du site.</p>
      </div>
    </section>

    <TweaksPanel />
  </main>
</template>

<style scoped>
.admin-page { padding-top: 100px; max-width: 1000px; margin: 0 auto; min-height: 100vh; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding: 0 20px; }
.admin-title { font-family: var(--font-serif); font-size: 32px; font-weight: 400; }
.admin-user { font-family: var(--font-mono); font-size: 12px; color: var(--ink-50); margin-top: 4px; }
.btn-logout { font-family: var(--font-mono); border-bottom: 1px solid var(--ink-25); padding: 4px 0; font-size: 13px; }

.admin-tabs { display: flex; gap: 10px; border-bottom: 1px solid var(--ink-12); margin-bottom: 40px; overflow-x: auto; padding: 0 20px; }
.tab-btn { padding: 12px 20px; font-size: 14px; font-weight: 500; color: var(--ink-50); border-bottom: 2px solid transparent; transition: all .2s; }
.tab-btn.active { color: var(--ink); border-bottom-color: var(--ink); }

.admin-section { animation: fadeIn .4s ease; padding: 0 20px; }
.sect-label { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-55); margin-bottom: 24px; }

.admin-form-box { background: var(--paper-warm); border: 1px solid var(--ink-08); padding: 32px; border-radius: 12px; margin-bottom: 48px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
.field-full { grid-column: span 2; }
.field-label { font-family: var(--font-sans); font-weight: 600; font-size: 13px; margin-bottom: 8px; display: block; }
input, select, textarea { width: 100%; padding: 12px; border: 1px solid var(--ink-12); border-radius: 6px; background: var(--paper); font-family: inherit; font-size: 15px; }
.btn-submit { background: var(--ink); color: var(--paper); padding: 16px 32px; border-radius: 99px; font-weight: 600; width: 100%; transition: opacity .2s; }
.btn-submit:disabled { opacity: 0.4; }

.admin-list { display: grid; gap: 12px; margin-bottom: 100px; }
.list-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--paper); border: 1px solid var(--ink-08); border-radius: 8px; }
.item-preview { width: 48px; height: 48px; background-size: cover; background-position: center; border-radius: 4px; background-color: var(--ink-08); flex-shrink: 0; }
.team-portrait{position:relative;overflow:hidden;border-radius:4px;aspect-ratio:1/1;}
.item-preview.circle { border-radius: 50%; }
.item-info { flex: 1; display: flex; flex-direction: column; }
.item-name { font-weight: 600; font-size: 16px; }
.item-sub { font-size: 12px; color: var(--ink-50); }
.btn-del { color: #b5263d; font-size: 13px; font-weight: 500; }

.admin-error { background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 6px; margin-bottom: 24px; font-size: 14px; text-align: center; }
.empty-msg { text-align: center; color: var(--ink-40); font-style: italic; margin-top: 20px; font-size: 14px; }
.info-note { background: var(--paper-cool); border: 1px solid var(--cool-12); padding: 20px; border-radius: 8px; color: var(--ink-60); font-size: 14px; text-align: center; margin-top: -20px; line-height: 1.5; }
.info-note strong { color: var(--ink); }

.upload-zone { display: flex; align-items: center; gap: 12px; }
.upload-loading { color: var(--ink-50); font-style: italic; font-size: 13px; }
.upload-success { color: #16a34a; font-weight: 500; font-size: 13px; }

.field-hint { font-size: 11px; color: var(--ink-40); margin-top: -8px; }
.upload-zone-wrapper { display: flex; flex-direction: column; gap: 12px; }
.form-image-preview { width: 120px; height: 120px; background-size: cover; background-position: center; border-radius: 8px; border: 1px solid var(--ink-12); background-color: var(--ink-05); }
.form-image-preview.circle { border-radius: 50%; }

.unread-badge { background: #b5263d; color: white; min-width: 18px; height: 18px; border-radius: 9px; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; padding: 0 5px; margin-left: 6px; vertical-align: middle; }

/* Message Layout */
.msg-layout { display: grid; grid-template-columns: 350px 1fr; gap: 32px; align-items: start; }
.msg-list { margin-bottom: 0; }
.msg-item { cursor: pointer; border: 1px solid var(--ink-05); }
.msg-item.active { border-color: var(--ink-25); background: var(--paper-warm); }
.msg-item.unread { border-left: 3px solid var(--ink); border-radius: 4px 8px 8px 4px; background: var(--paper); }
.msg-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
.msg-date { font-size: 10px; color: var(--ink-40); font-family: var(--font-mono); }
.text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
.btn-del-icon { color: var(--ink-25); font-size: 14px; padding: 4px; }
.btn-del-icon:hover { color: #b5263d; }

.msg-detail { position: sticky; top: 180px; }
.msg-detail-inner { background: var(--paper-warm); border: 1px solid var(--ink-08); border-radius: 12px; padding: 32px; }
.detail-header { margin-bottom: 24px; border-bottom: 1px solid var(--ink-08); padding-bottom: 20px; }
.detail-name { font-family: var(--font-serif); font-size: 24px; margin-bottom: 4px; }
.detail-meta { font-size: 13px; color: var(--ink-50); display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); }
.detail-body { margin-bottom: 32px; }
.detail-subject { font-size: 14px; margin-bottom: 16px; color: var(--ink); }
.detail-content { font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: var(--ink-80); }
.msg-placeholder { height: 300px; display: flex; align-items: center; justify-content: center; background: var(--paper-cool); border: 1px dashed var(--ink-12); border-radius: 12px; color: var(--ink-40); font-style: italic; }

.card-fade { animation: cardFade .3s ease-out; }
@keyframes cardFade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@media (max-width: 880px) { .msg-layout { grid-template-columns: 1fr; } }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
</style>
