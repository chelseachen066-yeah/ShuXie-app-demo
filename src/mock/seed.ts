import { ASSETS, excerptOf } from '../constants'
import { saveState, STORAGE_KEYS } from '../store/persist'
import type { Collection, ProfileState, ReadingSettingsState, Work } from '../types'

const now = Date.UTC(2026, 2, 18, 8, 0, 0)
const DAY_821 = Date.UTC(2026, 7, 21, 8, 0, 0)
const DAY_822 = Date.UTC(2026, 7, 22, 8, 0, 0)

const COL_ECHENG = 'col-echeng'
const COL_SUMMER = 'col-summer'
const COL_ESSAYS = 'col-essays'
const COL_FLOWERS = 'col-flowers'

const BODIES = {
  rain: `初夏的雨来得猝不及防，细密的雨丝织成灰蒙蒙的网，罩住了老城区的整条巷弄。林晚抱着旧书本躲进巷口的杂货铺屋檐，冰凉的晚风裹挟着水汽，拂得她指尖微微发凉。

老旧的木质屋檐不断滴落雨水，哒哒的声响单调又安稳。她随手翻开怀里泛黄的散文集，一片干枯的银杏书签从书页间滑落，轻轻落在湿漉漉的青石板上。

这片书签是去年秋天，外婆亲手为她压的。雨水打湿了书签一角，像无声落下的泪痕。她攥紧书签，鼻尖骤然发酸。

杂货铺的老人递来一杯温热的白开水。暖意顺着杯壁蔓延到手心。老人看着她手中的银杏叶，轻声道：“银杏最耐风雨，晒干了依旧平整坚韧，人也一样。”

雨势渐小。林晚擦干书签，小心翼翼夹回书页深处。原来所有的困顿都是暂时的，就像雨后终有晴空。`,
  orange: `在街边遇见那只小橘猫的时候，天刚好擦黑。它蹲在便利店纸箱边，尾巴卷成一个问号，看见人也不躲，只把眼睛睁得滚圆。

我蹲下去，它便把额头轻轻抵上我的指节，像是早就认识。口袋里只剩半根火腿肠，撕开包装，它吃得很慢，很认真。

后来我常绕那条路回家。有时它在，有时不在。不在的那些晚上，我会在纸箱旁停一秒，再走。

原来有些遇见，不必写成故事，也已经足够被记住。`,
  photo: `整理抽屉时翻到一张发黄的合影。背面用铅笔写着一个年份，字迹被时间磨得很浅。

照片里的人笑得很满，阳光从树叶缝里漏下来，打在肩膀上。我认得出那棵树，却认不出自己当时为什么那样站着。

把照片重新夹进书页。有些旧物不是为了被解释，只是为了在某个下午，突然把你轻轻拉回去。`,
  metro: `地铁里有人压低声音打电话，说“到了就好”。车厢晃了一下，所有人都跟着轻轻偏了偏。

我看着对面车窗里自己的影子，忽然想起很多个同样的傍晚：下班，入闸，靠着门，数站。

城市很大，可重复的路线会让人误以为日子没有缝。直到有一站，你抬起头，发现窗外的灯换了颜色。`,
}

function makeWork(
  id: string,
  title: string,
  body: string,
  collectionId: string | undefined,
  tags: Work['tags'],
  updatedAt: number,
): Work {
  return {
    id,
    title,
    body,
    excerpt: excerptOf(body),
    tags,
    collectionId,
    updatedAt,
  }
}

export const SEED_WORKS: Work[] = [
  makeWork(
    'work-rain-bookmark',
    '雨夜书签',
    BODIES.rain,
    COL_ECHENG,
    [{ id: 't1', label: '散文', type: 'genre' }],
    now,
  ),
  makeWork(
    'work-orange-cat',
    '街边的小橘猫',
    BODIES.orange,
    COL_FLOWERS,
    [
      { id: 't2', label: '散文', type: 'genre' },
      { id: 't3', label: '日常', type: 'topic' },
    ],
    now + 86400000,
  ),
  makeWork(
    'work-old-photo',
    '抽屉里的旧合影',
    BODIES.photo,
    COL_ECHENG,
    [{ id: 't4', label: '回忆', type: 'emotion' }],
    now + 86400000 * 2,
  ),
  makeWork(
    'work-metro-light',
    '某一站的灯光',
    BODIES.metro,
    COL_ESSAYS,
    [{ id: 't5', label: '城市', type: 'topic' }],
    now + 86400000 * 3,
  ),
]

export const SEED_COLLECTIONS: Collection[] = [
  {
    id: COL_ECHENG,
    name: '鄂城旧事',
    cover: ASSETS.covers[0],
    desc: '',
    works: ['work-rain-bookmark', 'work-old-photo'],
    updatedAt: DAY_821,
  },
  {
    id: COL_SUMMER,
    name: '夏日杂记',
    cover: ASSETS.covers[1],
    desc: '',
    works: [],
    updatedAt: DAY_822,
  },
  {
    id: COL_ESSAYS,
    name: '无处收录的随笔',
    cover: ASSETS.covers[2],
    desc: '',
    works: ['work-metro-light'],
    updatedAt: DAY_822,
  },
  {
    id: COL_FLOWERS,
    name: '花间集',
    cover: ASSETS.covers[3],
    desc: '',
    works: ['work-orange-cat'],
    updatedAt: DAY_821,
  },
]

export const SEED_PROFILE: ProfileState = {
  isLoggedIn: true,
  id: 'demo-user',
  nickname: '去码头整点薯条',
  avatar: null,
  bio: '在文字里慢慢走。',
}

export const SEED_READING: ReadingSettingsState = {
  colorKey: 'warm',
  textureKey: 'none',
  fontSize: 17,
  brightness: 0.8,
}

const SEED_VERSION = '2'

export function hydrateDemoData() {
  if (localStorage.getItem(STORAGE_KEYS.seeded) === SEED_VERSION) {
    return
  }

  saveState(STORAGE_KEYS.works, {
    works: SEED_WORKS,
    collections: SEED_COLLECTIONS,
  })
  if (!localStorage.getItem(STORAGE_KEYS.sessions)) {
    saveState(STORAGE_KEYS.sessions, { history: [] })
  }
  if (!localStorage.getItem(STORAGE_KEYS.highlights)) {
    saveState(STORAGE_KEYS.highlights, { highlights: [] })
  }
  saveState(STORAGE_KEYS.profile, SEED_PROFILE)
  if (!localStorage.getItem(STORAGE_KEYS.reading)) {
    saveState(STORAGE_KEYS.reading, SEED_READING)
  }

  localStorage.setItem(STORAGE_KEYS.seeded, SEED_VERSION)
}
