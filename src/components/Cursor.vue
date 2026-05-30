<script setup>
import { onMounted, onUnmounted } from 'vue'

let cleanup = () => {}

onMounted(() => {
  if (matchMedia('(pointer: coarse)').matches) return

  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  dot.innerHTML = '<span class="cursor-label"></span>'
  document.body.appendChild(dot)
  const label = dot.querySelector('.cursor-label')
  let x = window.innerWidth / 2
  let y = window.innerHeight / 2
  let tx = x
  let ty = y
  let raf

  const tick = () => {
    x += (tx - x) * 0.22
    y += (ty - y) * 0.22
    dot.style.transform = `translate(${x}px, ${y}px)`
    raf = requestAnimationFrame(tick)
  }
  tick()

  const move = (e) => {
    tx = e.clientX
    ty = e.clientY
  }
  const over = (e) => {
    const t = e.target.closest('[data-hover], a, button')
    const isOn = !!t
    dot.classList.toggle('is-active', isOn)
    const lbl = t?.dataset?.cursorLabel
    label.textContent = lbl || ''
    dot.classList.toggle('has-label', !!lbl)
  }
  const out = () => dot.classList.add('is-hidden')
  const enter = () => dot.classList.remove('is-hidden')

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseover', over)
  document.addEventListener('mouseleave', out)
  document.addEventListener('mouseenter', enter)

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseover', over)
    document.removeEventListener('mouseleave', out)
    document.removeEventListener('mouseenter', enter)
    dot.remove()
  }
})

onUnmounted(cleanup)
</script>

<template />
