export const WEDDING_DATE_ISO = '2026-11-01T13:00:00+09:00'

export const VENUE = {
  name: '서울올림픽파크텔 1F 올림피아홀',
  address: '서울올림픽파크텔',
  directionsUrl: 'https://www.parktel.co.kr/intrcn/stretGuidanceView.do',
  lat: 37.5221984,
  lng: 127.1164983,
}

export const GREETING_MESSAGE_PARAGRAPHS = [
  '스무 살 11월,\n서툴지만 설레는 마음으로 시작한 우리의 첫 계절.',
  '아홉 번의 가을과 겨울, 봄과 여름을 함께 지나 같은 11월,\n평생을 약속하는 날을 맞이하게 되었습니다.',
  '소중한 걸음으로 함께해 주신다면 큰 기쁨으로 간직하겠습니다.',
]

/* 하객에게 부탁하는 사진 미션. 사진 업로드 섹션 위에 붙는다 */
export const PHOTO_MISSION = {
  title: '📸 [미션] 저희의 스냅 작가가 되어주세요! 📸',
  items: [
    { text: '웃음이 만개한 순간, 가장 행복한 신랑신부' },
    { text: '설렘이 가득했던, 신부 대기실의 한 순간' },
    { text: '우리의 행복한 피날레, 신랑신부 행진' },
    { text: '눈빛만 봐도 알 수 있죠, 서로를 바라보는 순간' },
    {
      text: '오늘의 주인공은 저희만이 아니니까!',
      note: '가족, 친구들과 함께한 행복한 순간도 마음껏 보내주세요.\n여러분도 오늘의 주인공이니까요 :)',
    },
    {
      text: '감성 한 스푼, 예술 한 컷',
      note: '‘예술이란 이런 것이다!’ 싶은 사진도 환영합니다.',
    },
  ],
  reward: '🎁 미션 수행자 중 가장 멋진 컷을\n남겨주신 분께 맛있는 밥 한 끼를 쏩니다!',
  closing: '당일날, 아래 버튼을 통해 올려주세요!\n많은 참여 부탁드려요! 💖',
}

export interface ContactPerson {
  role: string
  name: string
  phone: string
  bank: string
  account: string
}

export const GROOM_CONTACTS: ContactPerson[] = [
  { role: '아버지', name: '정동준', phone: '010-6393-1476', bank: '우리', account: '436-036965-02-001' },
  { role: '어머니', name: '권춘자', phone: '010-3136-1476', bank: '국민', account: '573101-01-262270' },
  { role: '신랑', name: '정민수', phone: '010-9133-1476', bank: '국민', account: '573101-01-562219' },
]

export const BRIDE_CONTACTS: ContactPerson[] = [
  { role: '아버지', name: '김정식', phone: '010-4113-7244', bank: '농협', account: '352-1315-4154-73' },
  { role: '어머니', name: '김봉순', phone: '010-5480-2703', bank: '농협', account: '351-0301-6119-63' },
  { role: '신부', name: '김수현', phone: '010-4996-9402', bank: '국민', account: '304102-04-148851' },
]

export const NAVER_MAP_CLIENT_ID = 'uqzmpj3t4s'

export const BGM_SRC = '/bgm.m4a'
