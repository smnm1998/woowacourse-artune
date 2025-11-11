// OpenAI Assistant API 응답 + Spotify Tracks를 합친 최종 결과물
export const mockEmotionResult = {
  // OpenAI가 분석한 감정 정보
  emotion: 'joy',
  emotionLabel: '기쁨',
  intensity: 0.85,
  description: '오늘 하루 정말 행복한 일들이 가득했네요!',

  // OpenAI가 생성한 Spotify 파라미터
  immerse: {
    genres: ['pop', 'dance', 'funk'],
    valence: 0.9,
    energy: 0.85,
    tempo: 128,
  },
  soothe: {
    genres: ['acoustic', 'indie', 'chill'],
    valence: 0.6,
    energy: 0.3,
    tempo: 85,
  },

  // Spotify Recommendations API에서 받아온 실제 트랙들
  playlists: {
    immerse: {
      mode: 'immerse',
      modeLabel: '감정 심취',
      description: '이 기쁨을 더 깊이 느껴보세요',
      tracks: [
        {
          id: '60nZcImufyMA1MKQY3dcCH',
          name: 'Happy',
          artists: [{ name: 'Pharrell Williams' }],
          album: {
            name: 'G I R L',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b2732f429ed24c03a4c421462d88',
              },
            ],
          },
          duration_ms: 233000,
          preview_url: 'https://p.scdn.co/mp3-preview/example1',
          external_urls: {
            spotify: 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH',
          },
        },
        {
          id: '3RZ8GE5bZIeVnGmJJx1Xx5',
          name: 'Good Day',
          artists: [{ name: 'IU' }],
          album: {
            name: 'Real',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b273e681e00e94c6b16f73acc366',
              },
            ],
          },
          duration_ms: 247000,
          preview_url: 'https://p.scdn.co/mp3-preview/example2',
          external_urls: {
            spotify: 'https://open.spotify.com/track/3RZ8GE5bZIeVnGmJJx1Xx5',
          },
        },
        {
          id: '05wIrZSwuaVWhcv5FfqeH0',
          name: 'Walking On Sunshine',
          artists: [{ name: 'Katrina & The Waves' }],
          album: {
            name: 'Walking on Sunshine: The Best of Katrina and the Waves',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b273f3b2c70e85f5b0e1e0c7b8a9',
              },
            ],
          },
          duration_ms: 239000,
          preview_url: 'https://p.scdn.co/mp3-preview/example3',
          external_urls: {
            spotify: 'https://open.spotify.com/track/05wIrZSwuaVWhcv5FfqeH0',
          },
        },
        {
          id: '7hQJA50XrCWABAu5v6QZ4i',
          name: "Don't Stop Me Now",
          artists: [{ name: 'Queen' }],
          album: {
            name: 'Jazz',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
              },
            ],
          },
          duration_ms: 211000,
          preview_url: 'https://p.scdn.co/mp3-preview/example4',
          external_urls: {
            spotify: 'https://open.spotify.com/track/7hQJA50XrCWABAu5v6QZ4i',
          },
        },
        {
          id: '3ZFTkvIE7kyPt6Nu3PEa7V',
          name: 'Celebration',
          artists: [{ name: 'Kool & The Gang' }],
          album: {
            name: 'Celebrate!',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b273e3e3b64cea45265469d4cafa',
              },
            ],
          },
          duration_ms: 287000,
          preview_url: 'https://p.scdn.co/mp3-preview/example5',
          external_urls: {
            spotify: 'https://open.spotify.com/track/3ZFTkvIE7kyPt6Nu3PEa7V',
          },
        },
      ],
    },
    soothe: {
      mode: 'soothe',
      modeLabel: '감정 완화',
      description: '차분히 마음을 정리해보세요',
      tracks: [
        {
          id: '3jjsRKEsF0Y4QU1QD7TjfN',
          name: 'Weightless',
          artists: [{ name: 'Marconi Union' }],
          album: {
            name: 'Weightless',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856',
              },
            ],
          },
          duration_ms: 486000,
          preview_url: 'https://p.scdn.co/mp3-preview/example6',
          external_urls: {
            spotify: 'https://open.spotify.com/track/3jjsRKEsF0Y4QU1QD7TjfN',
          },
        },
        {
          id: '4JiEyzf0Qh4DAXFKqD1cP6',
          name: 'River Flows in You',
          artists: [{ name: 'Yiruma' }],
          album: {
            name: 'First Love',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b2733e384fc857774e01a356d097',
              },
            ],
          },
          duration_ms: 197000,
          preview_url: 'https://p.scdn.co/mp3-preview/example7',
          external_urls: {
            spotify: 'https://open.spotify.com/track/4JiEyzf0Qh4DAXFKqD1cP6',
          },
        },
        {
          id: '70B4zZZdVwAAXYDPYh5WJP',
          name: 'Clair de Lune',
          artists: [{ name: 'Claude Debussy' }],
          album: {
            name: 'Suite Bergamasque',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b273a8c8b5e6e5e5e5e5e5e5e5e5',
              },
            ],
          },
          duration_ms: 301000,
          preview_url: 'https://p.scdn.co/mp3-preview/example8',
          external_urls: {
            spotify: 'https://open.spotify.com/track/70B4zZZdVwAAXYDPYh5WJP',
          },
        },
        {
          id: '71PmZzD3VL3TfYPeaZCNjC',
          name: 'Breathe Me',
          artists: [{ name: 'Sia' }],
          album: {
            name: 'Colour the Small One',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b273e68f5b0f5b0f5b0f5b0f5b0f',
              },
            ],
          },
          duration_ms: 275000,
          preview_url: 'https://p.scdn.co/mp3-preview/example9',
          external_urls: {
            spotify: 'https://open.spotify.com/track/71PmZzD3VL3TfYPeaZCNjC',
          },
        },
        {
          id: '75JFxkI2RXiU7L9VXzMkle',
          name: 'The Scientist',
          artists: [{ name: 'Coldplay' }],
          album: {
            name: 'A Rush of Blood to the Head',
            images: [
              {
                url: 'https://i.scdn.co/image/ab67616d0000b273de09e8e83eaac2d1e9e9e9e9',
              },
            ],
          },
          duration_ms: 309000,
          preview_url: 'https://p.scdn.co/mp3-preview/example10',
          external_urls: {
            spotify: 'https://open.spotify.com/track/75JFxkI2RXiU7L9VXzMkle',
          },
        },
      ],
    },
  },

  // DALL-E로 생성한 아트워크
  artwork: {
    url: 'https://via.placeholder.com/512x512/FFD700/FFFFFF?text=Joy+Artwork',
    prompt:
      'A vibrant pixel art scene with golden honey cake and sparkling lemonade, warm sunlight rays, cheerful atmosphere, 8-bit retro style, dessert and coffee theme, cozy cafe setting',
    style: 'pixel-art',
    theme: 'dessert-coffee',
  },

  createdAt: new Date().toISOString(),
};
