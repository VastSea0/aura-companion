class AvatarEngine {
  constructor() {
    // Activity definitions with their aura impacts
    this.activities = {
    'Artistic Activities': {
      aura: 200,
      type: 'creative',
      messages: {
      completion: [
        "Great! Artistic activities nourish your soul! 🎨",
        "Your creativity is boosting your aura level! ✨"
      ]
      }
    },
    'Playing Games': {
      aura: [-100, 100], // negative or positive based on duration/type
      type: 'gaming',
      messages: {
      positive: [
        "You took a fun game break! 🎮",
        "Balanced game time relaxes your mind! 🎲"
      ],
      negative: [
        "Playing games for too long lowers your energy... 😮‍💨",
        "Maybe take a break and try a different activity? 🤔"
      ]
      }
    },
    'Watching Videos': {
      aura: -75,
      type: 'passive',
      messages: {
      completion: [
        "How about trying an active activity instead of watching videos? 🎯",
        "A little movement might be good for you! 🚶‍♂️"
      ]
      }
    },
    'Scrolling Photos on Social Media': {
      aura: -100,
      type: 'passive',
      messages: {
      completion: [
        "You took your social media break, now it's time to return to the real world! 🌱",
        "There's so much to discover in the outside world! 🌍"
      ]
      }
    },
    'Short Video Streaming': {
      aura: -200,
      type: 'passive',
      messages: {
      completion: [
        "Short videos have significantly lowered your aura... 📱",
        "How about reading a book? 📚"
      ]
      }
    },
    'Outdoor Activities': {
      aura: 150,
      type: 'active',
      messages: {
      completion: [
        "Outdoor activities are boosting your aura! 🌳",
        "Spending time in nature has done you good! 🌞"
      ]
      }
    },
    'Focus Required Activities': {
      aura: 250,
      type: 'focus',
      messages: {
      completion: [
        "Your concentration is great! Your aura is rising! 🎯",
        "Your focus is bringing amazing results! ⭐"
      ]
      }
    },
    'Social Activities': {
      aura: 100,
      type: 'social',
      messages: {
      completion: [
        "Social interactions are strengthening your aura! 👥",
        "Spending time with people has done you good! 🤝"
      ]
      }
    },
    'Reading Books': {
      aura: 100,
      type: 'passive',
      messages: {
      completion: [
        "Reading books is enriching your mind! 📚",
        "A good book can be a great companion! 📖"
      ]
      }
    },
    'Meditation': {
      aura: 150,
      type: 'relaxation',
      messages: {
      completion: [
        "Meditation is calming your mind and boosting your aura! 🧘‍♂️",
        "A peaceful mind leads to a peaceful life! 🌿"
      ]
      }
    },
    'Cooking': {
      aura: 50,
      type: 'creative',
      messages: {
      completion: [
        "Cooking is a great way to express creativity! 🍳",
        "A delicious meal can lift your spirits! 🍲"
      ]
      }
    },
    'Learning a New Skill': {
      aura: 200,
      type: 'educational',
      messages: {
      completion: [
        "Learning new skills is expanding your horizons! 📘",
        "Knowledge is power, and it's boosting your aura! 💡"
      ]
      }
    },
    'Exercising': {
      aura: 150,
      type: 'active',
      messages: {
      completion: [
        "Exercising is energizing your body and mind! 🏋️‍♂️",
        "A healthy body leads to a healthy mind! 💪"
      ]
      }
    },
    'Listening to Music': {
      aura: 50,
      type: 'relaxation',
      messages: {
      completion: [
        "Listening to music is soothing your soul! 🎶",
        "A good tune can lift your mood! 🎵"
      ]
      }
    },
    'Gardening': {
      aura: 100,
      type: 'active',
      messages: {
      completion: [
        "Gardening is connecting you with nature! 🌱",
        "Watching plants grow is a rewarding experience! 🌿"
      ]
      }
    },
    'Volunteering': {
      aura: 200,
      type: 'social',
      messages: {
      completion: [
        "Volunteering is making a positive impact on your community! 🤝",
        "Helping others is boosting your aura! 🌟"
      ]
      }
    }
    };
  
    this.moodStates = {
    veryLow: { threshold: 0, state: 'depressed' },
    low: { threshold: 200, state: 'worried' },
    moderate: { threshold: 500, state: 'neutral' },
    good: { threshold: 800, state: 'positive' },
    excellent: { threshold: 1000, state: 'excited' }
    };
  }
  
  calculateMood(currentAura) {
    for (const [mood, data] of Object.entries(this.moodStates).reverse()) {
    if (currentAura >= data.threshold) {
      return data.state;
    }
    }
    return this.moodStates.veryLow.state;
  }
  
  getActivityMessage(activityName, auraValue) {
    const activity = this.activities[activityName];
    if (!activity) return null;
  
    if (Array.isArray(activity.aura)) {
    // For activities that can be positive or negative (like gaming)
    return auraValue > 0 
      ? this.getRandomMessage(activity.messages.positive)
      : this.getRandomMessage(activity.messages.negative);
    }
  
    return this.getRandomMessage(activity.messages.completion);
  }
  
  getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  generateDailyMessage(currentAura, todaysActivities) {
    const mood = this.calculateMood(currentAura);
    const messages = {
    depressed: [
      "Today seems a bit challenging. Outdoor activities might do you good! 🌿",
      "Your aura is at low levels. Try a focus-required activity! 🎯"
    ],
    worried: [
      "Your aura might start to rise! How about trying an artistic activity? 🎨",
      "A bit of social activity might boost your aura! 👥"
    ],
    neutral: [
      "You're going balanced! You can raise your aura even more with new activities! ⚖️",
      "You're doing well! How about planning an outdoor activity? 🌳"
    ],
    positive: [
      "You're doing great! Your aura is rising! ⭐",
      "Your activity choices are excellent! Keep it up! 🌟"
    ],
    excited: [
      "You've caught an amazing energy! Your aura is at its highest levels! 🌈",
      "You're having an incredible day! Keep this energy up! ✨"
    ]
    };
  
    return this.getRandomMessage(messages[mood]);
  }
  
  getAvatarAnimation(mood) {
    // Animation mappings for your avatar
    return {
    depressed: 'depressed_animation',
    worried: 'worried_animation',
    neutral: 'neutral_animation',
    positive: 'happy_animation',
    excited: 'excited_animation'
    }[mood];
  }
  
  analyzeActivityPattern(activities) {
    const analysis = {
    positiveCount: 0,
    negativeCount: 0,
    mostFrequent: null,
    recommendation: ''
    };
  
    // Count activities and their impact
    activities.forEach(activity => {
    if (this.activities[activity.title]) {
      const auraImpact = this.activities[activity.title].aura;
      if (Array.isArray(auraImpact)) {
      // Handle gaming case
      activity.aura > 0 ? analysis.positiveCount++ : analysis.negativeCount++;
      } else {
      auraImpact > 0 ? analysis.positiveCount++ : analysis.negativeCount++;
      }
    }
    });
  
    // Generate recommendations based on pattern
    if (analysis.negativeCount > analysis.positiveCount) {
    analysis.recommendation = "You might consider adding more positive activities! For example: Outdoor activities or artistic events.";
    } else {
    analysis.recommendation = "You're doing great! Your activity balance is very good!";
    }
  
    return analysis;
  }
  
  getActivityMessage(activity, aura) {
    // Pozitif aktiviteler için mesajlar
    const positiveMessages = [
      `Harika! ${activity} ile ruhunu besliyorsun! (+${aura})`,
      `${activity} yaparak kendine yatırım yapıyorsun! (+${aura})`,
      `${activity} ile pozitif enerji topluyorsun! (+${aura})`,
      `Muhteşem! ${activity} auranı yükseltiyor! (+${aura})`
    ];

    // Negatif aktiviteler için mesajlar
    const negativeMessages = [
      `${activity} auranı düşürüyor... (${aura})`,
      `Dikkat! ${activity} ruhsal enerjini azaltıyor (${aura})`,
      `${activity} ile auran azalıyor... (${aura})`,
      `${activity} yaparken dikkatli ol, auran düşüyor (${aura})`
    ];

    // Rastgele mesaj seçimi
    const messages = aura > 0 ? positiveMessages : negativeMessages;
    const randomIndex = Math.floor(Math.random() * messages.length);
    
    return messages[randomIndex];
  }
  
  // Diğer avatar engine metodları buraya eklenebilir
  getAvatarState(aura) {
    if (aura >= 800) return 'enlightened';
    if (aura >= 500) return 'happy';
    if (aura >= 200) return 'content';
    if (aura >= 0) return 'neutral';
    if (aura >= -200) return 'tired';
    if (aura >= -500) return 'exhausted';
    return 'depleted';
  }
}

export default AvatarEngine;