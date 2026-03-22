export interface AppointmentTemplate {
  type:        string
  icon:        string
  description: string
  typicalAge:  string
  questions:   string[]
}

export const APPOINTMENT_TEMPLATES: AppointmentTemplate[] = [
  {
    type:       'Midwife Visit',
    icon:       '👩‍⚕️',
    description: 'Postnatal home visit',
    typicalAge:  '1–2 weeks',
    questions: [
      'Is her weight gain on track?',
      'Is my milk supply adequate?',
      'Is the umbilical cord healing normally?',
      'What should her poo look like at this stage?',
      'What are signs of jaundice to watch for?',
      'Am I breastfeeding correctly — latch, position?',
      'What are signs of postnatal depression I should know about?',
      'When should I be concerned enough to call someone?',
    ],
  },
  {
    type:       'Obstetrician',
    icon:       '🏥',
    description: 'Postnatal follow-up',
    typicalAge:  '2–6 weeks',
    questions: [
      'Is my recovery progressing normally?',
      'When can I return to exercise?',
      'What contraception is appropriate while breastfeeding?',
      'Are there any concerns from the birth I should be aware of?',
      'What are signs of postnatal depression and who do I contact?',
    ],
  },
  {
    type:       '6 Week Check',
    icon:       '👶',
    description: 'Paediatrician — first major developmental check',
    typicalAge:  '6 weeks',
    questions: [
      'Is her weight and length on track for her age?',
      'Is her head circumference within normal range?',
      'Is she feeding the right amount for her weight?',
      'Is she meeting her developmental milestones for 6 weeks?',
      'Should I be concerned about any physical features I\'ve noticed?',
      'When do the first vaccinations happen and what are they?',
      'Is it normal that she\'s still waking every 2–3 hours at night?',
      'What should I watch for between now and the 4-month check?',
      'Is reflux or colic something we should be managing differently?',
    ],
  },
  {
    type:       '4 Month Check',
    icon:       '👶',
    description: 'Vaccinations + developmental check',
    typicalAge:  '4 months',
    questions: [
      'Is her motor development on track — rolling, head control?',
      'She\'s waking more at night than before — is this the 4-month regression?',
      'When can we start introducing solids?',
      'Is her weight gain still appropriate?',
      'Are there any signs of hip dysplasia I should know about?',
      'What vaccinations are being given today and what side effects should I expect?',
    ],
  },
  {
    type:       '6 Month Check',
    icon:       '👶',
    description: 'Vaccinations + developmental check',
    typicalAge:  '6 months',
    questions: [
      'How is her solid food introduction going — what to introduce and when?',
      'Is she sitting with support at the right time?',
      'Any concerns about her vision or hearing?',
      'Should I be giving an iron supplement?',
      'When should teeth appear and how do I care for them?',
    ],
  },
  {
    type:       '12 Month Check',
    icon:       '🎂',
    description: 'Vaccinations + first birthday check',
    typicalAge:  '12 months',
    questions: [
      'Is her language development on track?',
      'She\'s not walking yet — is that a concern?',
      'What should her diet look like now — portion sizes, variety?',
      'When should I wean from breast/bottle?',
      'Any concerns about her social development?',
    ],
  },
  {
    type:       'GP',
    icon:       '🩺',
    description: 'General practitioner visit',
    typicalAge:  'As needed',
    questions: [
      'Is this symptom something to be concerned about?',
      'Is this normal for her age?',
      'What medication is safe to give and at what dose?',
    ],
  },
  {
    type:       'Other',
    icon:       '📋',
    description: 'Other appointment',
    typicalAge:  '',
    questions: [],
  },
]

export function getQuestionsForType(type: string, ageWeeks: number): string[] {
  const template = APPOINTMENT_TEMPLATES.find(t => t.type === type)
  if (template && template.questions.length) return template.questions

  // Generic age-appropriate questions if no template match
  if (ageWeeks < 6)  return APPOINTMENT_TEMPLATES[0].questions
  if (ageWeeks < 12) return APPOINTMENT_TEMPLATES[2].questions
  if (ageWeeks < 20) return APPOINTMENT_TEMPLATES[3].questions
  return APPOINTMENT_TEMPLATES[4].questions
}
