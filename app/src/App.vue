<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

type StoryMode = 'story' | 'guided'
type Language = 'en' | 'fr'
type ChapterLength = 30 | 100 | 250

type FeatureOption = {
  id: number
  name: string
  description: string[]
}

const chapterIds = [1, 2, 3, 4, 5, 6] as const
const storyMode = ref<StoryMode>('story')
const selectedLanguage = ref<Language>('en')
const selectedLength = ref<ChapterLength>(100)
const selectedOptions = ref<Record<number, number | null>>({
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
})
const featureOptionsByChapter = ref<Record<number, FeatureOption[]>>({})
const isLoading = ref(true)
const apiError = ref<string | null>(null)

const allChaptersConfigured = computed(() =>
  chapterIds.every((chapter) => selectedOptions.value[chapter] !== null),
)

const readyToStartStory = computed(
  () => storyMode.value === 'story' && !isLoading.value && !apiError.value && allChaptersConfigured.value,
)

const chapterOptions = (chapter: number) => featureOptionsByChapter.value[chapter] ?? []

async function fetchFeatureOptionsForChapter(chapter: number) {
  const response = await fetch(
    `http://localhost:7071/api/feature-options?c=${chapter}&l=${selectedLanguage.value}`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch options for chapter ${chapter}`)
  }

  const payload = (await response.json()) as { options?: FeatureOption[] }
  return payload.options ?? []
}

async function loadFeatureOptions() {
  isLoading.value = true
  apiError.value = null

  try {
    const results = await Promise.all(
      chapterIds.map(async (chapter) => ({
        chapter,
        options: await fetchFeatureOptionsForChapter(chapter),
      })),
    )

    const nextFeatureOptions: Record<number, FeatureOption[]> = {}
    for (const { chapter, options } of results) {
      nextFeatureOptions[chapter] = options
    }

    featureOptionsByChapter.value = nextFeatureOptions
    for (const chapter of chapterIds) {
      if (!nextFeatureOptions[chapter]?.some((option) => option.id === selectedOptions.value[chapter])) {
        selectedOptions.value[chapter] = null
      }
    }
  } catch (error) {
    apiError.value = 'Could not load story setup'
    featureOptionsByChapter.value = {}
    for (const chapter of chapterIds) {
      selectedOptions.value[chapter] = null
    }
    console.error('App setup load failed', error)
  } finally {
    isLoading.value = false
  }
}

function selectOption(chapter: number, optionId: number) {
  selectedOptions.value[chapter] = optionId
}

function retryLoad() {
  void loadFeatureOptions()
}

function exitStorySetup() {
  apiError.value = null
  isLoading.value = false
}

watch(selectedLanguage, () => {
  void loadFeatureOptions()
})

onMounted(() => {
  void loadFeatureOptions()
})
</script>

<template>
  <main class="story-setup">
    <header>
      <p class="eyebrow">New Story</p>
      <h1>Story setup</h1>
    </header>

    <div v-if="apiError" class="error-panel" role="alert">
      <p>{{ apiError }}</p>
      <div class="error-actions">
        <button data-test="retry-button" type="button" @click="retryLoad">Retry</button>
        <button type="button" @click="exitStorySetup">Exit</button>
      </div>
    </div>

    <section v-else class="setup-panel">
      <div class="mode-picker" aria-label="Story mode">
        <label>
          <input v-model="storyMode" data-test="story-mode-button" type="radio" value="story" />
          Story Mode
        </label>
        <label>
          <input v-model="storyMode" type="radio" value="guided" />
          Guided Adventure
        </label>
      </div>

      <div class="settings" aria-label="Global settings">
        <fieldset>
          <legend>Language</legend>
          <label>
            <input v-model="selectedLanguage" data-test="language-en" type="radio" value="en" />
            English
          </label>
          <label>
            <input v-model="selectedLanguage" data-test="language-fr" type="radio" value="fr" />
            French
          </label>
        </fieldset>

        <fieldset>
          <legend>Chapter Length</legend>
          <label>
            <input v-model="selectedLength" data-test="chapter-length-30" type="radio" :value="30" />
            30 words
          </label>
          <label>
            <input v-model="selectedLength" data-test="chapter-length-100" type="radio" :value="100" />
            100 words
          </label>
          <label>
            <input v-model="selectedLength" data-test="chapter-length-250" type="radio" :value="250" />
            250 words
          </label>
        </fieldset>
      </div>

      <div v-if="isLoading" class="loading">Loading story options…</div>

      <div v-else class="chapter-grid">
        <div v-for="chapter in chapterIds" :key="chapter" class="chapter-panel">
          <h2>Chapter {{ chapter }}</h2>

          <div v-if="chapterOptions(chapter).length" class="option-list">
            <button
              v-for="option in chapterOptions(chapter)"
              :key="option.id"
              :data-test="`chapter-${chapter}-option-${option.id}`"
              :class="{ selected: selectedOptions[chapter] === option.id }"
              type="button"
              @click="selectOption(chapter, option.id)"
            >
              {{ option.name }}
            </button>
          </div>

          <p v-else>No options available for this chapter.</p>
        </div>
      </div>

      <div v-if="readyToStartStory" class="story-ready">Story ready to begin</div>

      <button
        data-test="start-story-button"
        type="button"
        :disabled="!readyToStartStory"
      >
        Start Story
      </button>
    </section>
  </main>
</template>

<style scoped>
.story-setup {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
  font-family: Arial, sans-serif;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  color: #5b5f6c;
}

h1,
h2,
p {
  margin-top: 0;
}

.setup-panel,
.error-panel {
  background: #f8f8fb;
  border: 1px solid #e1e3ea;
  border-radius: 12px;
  padding: 1rem;
}

.mode-picker,
.settings,
.option-list,
.error-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

fieldset {
  border: 1px solid #d5d7dc;
  border-radius: 8px;
  padding: 0.75rem;
  min-width: 180px;
}

.chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.chapter-panel {
  border: 1px solid #dde0eb;
  border-radius: 10px;
  padding: 0.75rem;
  background: #fff;
}

.option-list {
  flex-direction: column;
}

button {
  border: 1px solid #c5cce0;
  background: white;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  cursor: pointer;
}

button.selected {
  background: #dfeeff;
  border-color: #6aa7ff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.story-ready {
  margin-top: 1rem;
  font-weight: 700;
  color: #0b5f3a;
}

.loading {
  margin-top: 1rem;
  color: #5b5f6c;
}

.error-panel {
  color: #7a1f1f;
}
</style>
