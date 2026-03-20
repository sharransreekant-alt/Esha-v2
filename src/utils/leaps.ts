// Wonder Weeks developmental leaps data
// Timing based on weeks after birth (full-term reference)
// Descriptions written independently based on published child development research

export interface Leap {
  number:      number
  name:        string
  weekStart:   number   // week after birth when fussy phase begins
  weekPeak:    number   // week fussy phase peaks / skills phase begins
  weekEnd:     number   // week leap completes
  fussyDesc:   string   // what parents notice during fussy phase
  skillsDesc:  string   // what baby is developing
  tips:        string[] // practical tips for parents
  playIdeas:   string[] // simple activities to support development
}

export const LEAPS: Leap[] = [
  {
    number:    1,
    name:      'World of Sensations',
    weekStart: 4,
    weekPeak:  5,
    weekEnd:   6,
    fussyDesc: 'Baby may seem unsettled, cry more than usual, feed more frequently, and want to be held constantly. Sleep may be disrupted.',
    skillsDesc: 'Baby\'s senses are sharpening. She\'s becoming more aware of what she can see, hear, smell, taste and feel. She may start to focus on your face more intentionally.',
    tips: [
      'Extra cuddles and skin-to-skin contact help enormously right now',
      'This unsettled period typically lasts 1–2 weeks — it will pass',
      'Feeding more frequently is normal and helps build your milk supply',
      'Trust your instincts — you can\'t spoil a newborn with comfort',
    ],
    playIdeas: [
      'Make eye contact and talk to her softly — your face is her favourite thing',
      'Gentle rocking and skin-to-skin time on your chest',
      'Soft music or your singing voice — she recognises it from the womb',
    ],
  },
  {
    number:    2,
    name:      'World of Patterns',
    weekStart: 7,
    weekPeak:  8,
    weekEnd:   10,
    fussyDesc: 'Another fussy period — more crying, clinginess, and disrupted sleep. Baby may seem bored or frustrated easily.',
    skillsDesc: 'Baby is starting to recognise simple patterns — in sounds, sights and movements. She may begin to track a moving object with her eyes and respond more consistently to your voice.',
    tips: [
      'Respond to her cues promptly — this builds trust and brain connections',
      'She may be overstimulated easily — keep environments calm',
      'Talking and singing to her throughout the day supports language development',
    ],
    playIdeas: [
      'Slowly move a high-contrast black and white object across her vision',
      'Talk to her in an animated, varied voice — watch her respond',
      'Gentle, rhythmic movement like rocking or a slow walk',
    ],
  },
  {
    number:    3,
    name:      'World of Smooth Transitions',
    weekStart: 11,
    weekPeak:  12,
    weekEnd:   13,
    fussyDesc: 'Third fussy phase — expect clinginess and more feeding. She may seem harder to satisfy than usual.',
    skillsDesc: 'Baby is discovering that movements can be smooth and continuous rather than jerky. She\'s gaining more control of her body and may start making smoother arm and leg movements.',
    tips: [
      'Tummy time becomes even more important now for building strength',
      'She may start to bat at objects — encourage this',
      'Smile back at her — she\'s starting to associate expressions with feelings',
    ],
    playIdeas: [
      'Tummy time on your chest or a firm surface — aim for a few minutes several times a day',
      'Hang a simple mobile above her — she\'ll start watching it move',
      'Let her grip your finger and gently move her arm — she\'ll enjoy the motion',
    ],
  },
  {
    number:    4,
    name:      'World of Events',
    weekStart: 14,
    weekPeak:  17,
    weekEnd:   20,
    fussyDesc: 'This is the longest leap. Expect several weeks of unsettledness, clingy behaviour, and disrupted sleep. The "4-month sleep regression" often coincides with this leap.',
    skillsDesc: 'Baby begins to understand that things happen in sequences. She\'s starting to anticipate — reaching for objects, expecting a response when she makes a sound. This is a major cognitive leap.',
    tips: [
      'The 4-month sleep regression is real and part of this leap — it will improve',
      'Routines help — she\'s starting to anticipate what comes next',
      'She may start rolling — watch her on elevated surfaces',
      'Serve and return conversations (responding to her sounds) are crucial now',
    ],
    playIdeas: [
      'Put objects just within reach and encourage her to grab them',
      'Play peek-a-boo — she\'s starting to understand object permanence',
      'Respond to every sound she makes as if it\'s a conversation',
      'Reading books with simple, bold images',
    ],
  },
  {
    number:    5,
    name:      'World of Relationships',
    weekStart: 22,
    weekPeak:  24,
    weekEnd:   26,
    fussyDesc: 'Strong separation anxiety may emerge. Baby becomes intensely attached to primary caregivers and may cry when anyone else holds her.',
    skillsDesc: 'Baby starts to understand the relationships between things — near and far, inside and outside, cause and effect. This is when she realises you can leave and come back.',
    tips: [
      'Separation anxiety is healthy — it means attachment is developing well',
      'Always say goodbye when you leave — sneaking out makes anxiety worse long-term',
      'She\'s learning that relationships are consistent and trustworthy',
    ],
    playIdeas: [
      'Hide-and-seek games — peek around a corner, disappear and return',
      'Nesting cups and containers — in and out concepts',
      'Let her explore cause-and-effect toys',
    ],
  },
  {
    number:    6,
    name:      'World of Categories',
    weekStart: 33,
    weekPeak:  35,
    weekEnd:   38,
    fussyDesc: 'Clingy, demanding, and easily frustrated. Baby may seem like she wants everything and nothing at the same time.',
    skillsDesc: 'Baby begins to categorise her world — animals are different from people, soft things from hard things. This is the foundation of all future learning and language.',
    tips: [
      'Name everything — she\'s building vocabulary even if she can\'t say words yet',
      'Books with pictures of real objects (not cartoons) are excellent',
      'Let her touch and explore different textures safely',
    ],
    playIdeas: [
      'Sort toys by colour or size together',
      'Books with clear photos of animals, food, faces',
      'Let her feel different textures — soft, rough, smooth, bumpy',
    ],
  },
  {
    number:    7,
    name:      'World of Sequences',
    weekStart: 41,
    weekPeak:  43,
    weekEnd:   47,
    fussyDesc: 'Another challenging period — baby may be clingy and test limits more. Sleep may regress again.',
    skillsDesc: 'Baby understands that things happen in a specific order. She can start simple multi-step tasks and follow simple instructions. This is when "doing things herself" becomes important.',
    tips: [
      'Let her "help" with simple tasks — putting things in, taking things out',
      'Consistent daily routines are very comforting at this stage',
      'She\'s not being naughty — she\'s experimenting with cause and effect',
    ],
    playIdeas: [
      'Simple stacking and sorting activities',
      'Filling and emptying containers',
      'Simple action songs with repeated sequences',
    ],
  },
  {
    number:    8,
    name:      'World of Programs',
    weekStart: 51,
    weekPeak:  53,
    weekEnd:   55,
    fussyDesc: 'Baby may become particularly demanding. She knows what she wants but can\'t always communicate it — frustration is normal.',
    skillsDesc: 'Baby begins to understand that a goal requires a flexible plan — not just a fixed sequence. She can problem-solve simple obstacles and adapt her approach when something doesn\'t work.',
    tips: [
      'Give her space to problem-solve before stepping in',
      'Acknowledge her frustration — "I can see that\'s hard"',
      'Simple choices give her a sense of control',
    ],
    playIdeas: [
      'Simple shape sorters and puzzles',
      'Building blocks to knock down',
      'Push and pull toys',
    ],
  },
  {
    number:    9,
    name:      'World of Principles',
    weekStart: 60,
    weekPeak:  62,
    weekEnd:   65,
    fussyDesc: 'Baby may seem very emotional and strong-willed. Testing limits is part of this leap.',
    skillsDesc: 'Baby begins to understand basic principles — rules that apply across many situations. She\'s developing a sense of fairness and starts understanding "mine" and "yours".',
    tips: [
      'Consistent, predictable rules help her feel safe',
      'Tantrums are normal — she\'s feeling big emotions with a small brain',
      'Praise effort and process, not just results',
    ],
    playIdeas: [
      'Simple pretend play — tea parties, feeding stuffed animals',
      'Books about emotions and feelings',
      'Simple games with turns',
    ],
  },
  {
    number:    10,
    name:      'World of Systems',
    weekStart: 71,
    weekPeak:  73,
    weekEnd:   76,
    fussyDesc: 'The final major leap. Baby may seem particularly challenging — strong opinions, more tantrums, pushing every boundary.',
    skillsDesc: 'Baby starts to understand that systems are made up of flexible principles. She begins developing her own unique personality, values and preferences. She\'s becoming a little person.',
    tips: [
      'She\'s not being difficult — she\'s becoming her own person',
      'Choices and autonomy matter enormously to her now',
      'This is the foundation of independence — encourage it',
    ],
    playIdeas: [
      'Creative and imaginative play with open-ended toys',
      'Simple art — finger painting, playdough',
      'Real-life role play — cooking, shopping, caring for dolls',
    ],
  },
]

export interface LeapStatus {
  currentLeap:  Leap | null
  phase:        'fussy' | 'skills' | 'between' | 'complete'
  weekAge:      number
  daysUntilNext: number | null
  nextLeap:     Leap | null
  weeksUntilNext: number | null
}

export function getLeapStatus(birthDate: Date): LeapStatus {
  const now     = new Date()
  const msAge   = now.getTime() - birthDate.getTime()
  const weekAge = msAge / (7 * 24 * 60 * 60 * 1000)

  // Find current leap
  for (let i = 0; i < LEAPS.length; i++) {
    const leap = LEAPS[i]
    if (weekAge >= leap.weekStart && weekAge <= leap.weekEnd) {
      const phase: 'fussy' | 'skills' = weekAge < leap.weekPeak ? 'fussy' : 'skills'
      const nextLeap = LEAPS[i + 1] || null
      const weeksUntilNext = nextLeap ? nextLeap.weekStart - weekAge : null
      return {
        currentLeap: leap,
        phase,
        weekAge,
        daysUntilNext: weeksUntilNext !== null ? Math.round(weeksUntilNext * 7) : null,
        nextLeap,
        weeksUntilNext,
      }
    }
    // Between leaps
    const nextLeap = LEAPS[i + 1]
    if (nextLeap && weekAge > leap.weekEnd && weekAge < nextLeap.weekStart) {
      const weeksUntilNext = nextLeap.weekStart - weekAge
      return {
        currentLeap: null,
        phase: 'between',
        weekAge,
        daysUntilNext: Math.round(weeksUntilNext * 7),
        nextLeap,
        weeksUntilNext,
      }
    }
  }

  // Before first leap
  if (weekAge < LEAPS[0].weekStart) {
    const weeksUntilNext = LEAPS[0].weekStart - weekAge
    return {
      currentLeap: null,
      phase: 'between',
      weekAge,
      daysUntilNext: Math.round(weeksUntilNext * 7),
      nextLeap: LEAPS[0],
      weeksUntilNext,
    }
  }

  // After all leaps
  return { currentLeap: null, phase: 'complete', weekAge, daysUntilNext: null, nextLeap: null, weeksUntilNext: null }
}

export function leapContextForAI(status: LeapStatus): string {
  if (status.phase === 'complete') {
    return `Developmental leaps: All 10 major leaps complete (baby is over 17 months old).`
  }
  if (status.currentLeap) {
    const l = status.currentLeap
    return `Developmental leap: Currently in Leap ${l.number} — "${l.name}" (${status.phase} phase).
Fussy phase description: ${l.fussyDesc}
What she's developing: ${l.skillsDesc}
Tips: ${l.tips.slice(0,2).join('; ')}`
  }
  return `Developmental leap: Between leaps. Next leap (Leap ${status.nextLeap?.number} — "${status.nextLeap?.name}") starts in approximately ${status.daysUntilNext} days.`
}
