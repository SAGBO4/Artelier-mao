<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit(e) {
  e.preventDefault()
  error.value = ''
  loading.value = true
  try {
    const { data: resData, error: err } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (err) throw err
    router.replace(route.query.next || '/admin')
  } catch (e2) {
    error.value = e2?.message || 'Connexion impossible'
    console.error('Login error:', e2)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page" style="padding-top: 96px; max-width: 680px">
    <section class="section" style="border-top: 0; padding-top: 0">
      <h1 class="presta-title">
        Admin<br />
        <em>Connexion</em>
      </h1>
      <p class="presta-lead">Connecte-toi pour gérer le contenu du site.</p>

      <form class="contact-form-simple" style="margin-top: 28px" @submit="onSubmit">
        <label class="field">
          <span class="field-label">Email</span>
          <input v-model="email" type="email" required placeholder="admin@latelier.bj" />
        </label>
        <label class="field">
          <span class="field-label">Mot de passe</span>
          <input v-model="password" type="password" required placeholder="••••••••" />
        </label>

        <p v-if="error" class="footer-line" style="color: #b5263d">{{ error }}</p>

        <div class="form-nav form-nav-simple">
          <button class="btn-primary" type="submit" :disabled="loading">
            <span v-if="loading">Connexion…</span>
            <span v-else>Se connecter</span>
            <span class="btn-arrow" aria-hidden="true">↗</span>
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

