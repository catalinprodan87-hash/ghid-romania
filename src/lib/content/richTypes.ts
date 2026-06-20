// Types for the two "rich" content shapes wired in this task:
//  - "topics" shape  → Institutions, Health
//  - "phrasebook" shape → Phrasebook / Emergency
// Field names match the authored JSON exactly — do not rename.

// ---- Topics shape ----

export interface TopicForm {
  label: string
  url: string
}

export interface TopicContact {
  label: string
  value: string
  url?: string
}

export interface TopicSource {
  label: string
  url: string
  verified: string
}

export interface Topic {
  id: string
  title: string
  summary: string
  eligibility?: string[]
  validity?: string
  steps?: string[]
  documents?: string[]
  forms?: TopicForm[]
  contacts?: TopicContact[]
  notes?: string[]
  sources?: TopicSource[]
}

export interface TopicsMeta {
  section: string
  language: string
  updated: string
  disclaimer: string
  topicShape: string
}

export interface TopicsContent {
  _meta: TopicsMeta
  topics: Topic[]
}

// ---- Phrasebook shape ----

export interface Phrase {
  ro: string
  uk: string
  pron_uk: string
}

export interface PhraseCategory {
  id: string
  title: string
  phrases: Phrase[]
}

export interface PhrasebookMeta {
  section: string
  language: string
  updated: string
  note: string
  shape: string
}

export interface PhrasebookContent {
  _meta: PhrasebookMeta
  categories: PhraseCategory[]
}
