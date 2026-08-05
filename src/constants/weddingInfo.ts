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

// TODO: 네이버 폼 생성 후 실제 URL로 교체 (TODO.md 참고)
export const PHOTO_UPLOAD_FORM_URL = 'https://form.naver.com/REPLACE_ME'

export const NAVER_MAP_CLIENT_ID = 'uqzmpj3t4s'

export const BGM_SRC = '/bgm.m4a'
