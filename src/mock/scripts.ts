export const DEMO_HINT =
  'Demo 版暂不连接模型，请点击建议回复体验完整流程'

export const DEMO_REPLAY_TAG = '演示回放 · 示例内容'

export type ScriptRole = 'ai' | 'user'

export type ScriptTurn = {
  role: ScriptRole
  text: string
}

export type ActionCardDefaults = {
  gender: '男生' | '女生' | '不限'
  perspective: '以我的口吻' | '以旁观者视角'
  protagonistName: string
}

export type ScriptVersion = {
  title: string
  content: string
}

/**
 * 回放剧本。
 * 进入剧本时，`prompt`（灵感卡文案）会作为第一条用户消息显示；
 * `turns` 从 AI 对它的第一次追问开始，AI / 用户交替，最后以 AI 收束结尾。
 */
export type CreateScript = {
  id: string
  prompt: string
  turns: ScriptTurn[]
  actionCard: ActionCardDefaults
  versions: [ScriptVersion, ScriptVersion]
}

/** 直接写：预置草稿，成文复用对应剧本的两版 */
export const DIRECT_WRITE = {
  scriptId: 'script-summer',
  draft: '那年夏天外婆坐在廊下剥莲子，蒲扇一下一下，蝉声把整个午后都撑满了。我想把这段话写成一篇短散文。',
}

export const CREATE_SCRIPTS: CreateScript[] = [
  {
    id: 'script-summer',
    prompt: '外婆讲过的那个夏天',
    turns: [
      {
        role: 'ai',
        text: '那个夏天，外婆是在哪儿跟你讲的？你还记得她当时手里在做什么吗？',
      },
      {
        role: 'user',
        text: '在老家的廊下，她一边剥莲子一边讲，说话特别慢，蒲扇一下一下地摇。',
      },
      {
        role: 'ai',
        text: '“说话特别慢”——是因为她边讲边想，还是故意放慢给你听？那天廊下除了你们俩，还有别的声音吗？',
      },
      {
        role: 'user',
        text: '只有蝉叫。她讲完会问我一句：记住了没有。我每次都说记住了，其实没怎么听懂。',
      },
      {
        role: 'ai',
        text: '“记住了没有”和“其实没怎么听懂”，这两句放在一起很有意思。蝉声、蒲扇和这句追问，已经够撑起一篇短文了，我们开始整理吧。',
      },
    ],
    actionCard: {
      gender: '不限',
      perspective: '以我的口吻',
      protagonistName: '',
    },
    versions: [
      {
        title: '廊下的夏天',
        content:
          '蒲扇停下来的时候，蝉声反而更响。外婆把莲子剥开，不看我，只把故事往阴凉里放。讲完她问：记住了没有。我说记住了。其实记住的是那一小块不肯晒到的地砖。',
      },
      {
        title: '记住了没有',
        content:
          '那年夏天没有惊心动魄，只有廊下一条不肯结束的阴影。外婆的句子都很短，像怕风把它们吹散。她问我记住了没有。许多年后我才懂，她要我记住的不是故事，是那种被慢慢对待的感觉。',
      },
    ],
  },
  {
    id: 'script-cat',
    prompt: '在街边捡到一只小橘猫',
    turns: [
      {
        role: 'ai',
        text: '是哪条街、什么时候遇到的？它当时是一个人待着，还是旁边有纸箱之类的东西？',
      },
      {
        role: 'user',
        text: '下班路上，便利店门口，旁边有个破纸箱。它不怎么怕人，尾巴卷着，像在等谁把它带走。',
      },
      {
        role: 'ai',
        text: '“像在等谁把它带走”——你当时是怎么回应它的？蹲下来了，还是只站着看了一会儿？',
      },
      {
        role: 'user',
        text: '我蹲下来给它撕了半根火腿肠，它吃得很慢。后来没带走它，那几天我特意绕路去看，纸箱一直空着。',
      },
      {
        role: 'ai',
        text: '“特意绕路去看”“纸箱一直空着”，这个细节很有分量。不用写成收养的结局，就写这场遇见和之后的那条路，我们开始整理吧。',
      },
    ],
    actionCard: {
      gender: '不限',
      perspective: '以我的口吻',
      protagonistName: '',
    },
    versions: [
      {
        title: '纸箱边',
        content:
          '便利店的灯把地面分成两块。橘猫蹲在暗的那一块，尾巴问号一样卷着。我把火腿肠撕开，它吃得很慢。像怕这顿饭配不上一次认真的遇见。',
      },
      {
        title: '没有名字的晚上',
        content:
          '有些生命只经过你一次。它不需要名字，纸箱也不需要被写成家。后来我仍绕那条路，空着也好，像把位置留给可能回来的光。',
      },
    ],
  },
  {
    id: 'script-photo',
    prompt: '翻到一张童年的老照片',
    turns: [
      {
        role: 'ai',
        text: '照片是在哪里拍的？你当时大概几岁，还能认出照片里的自己吗？',
      },
      {
        role: 'user',
        text: '在老家院子里的那棵树下，大概六七岁。我认得那棵树，却不太认得自己当时的表情，板着脸，像在生谁的气。',
      },
      {
        role: 'ai',
        text: '“不太认得自己当时的表情”——是觉得陌生，还是想起了那天发生的什么事？拍照的人是谁？',
      },
      {
        role: 'user',
        text: '更像陌生。拍照的是我妈，她让我笑，我偏不笑。照片夹在一本旧书里，背面有铅笔写的年份，已经很浅了。',
      },
      {
        role: 'ai',
        text: '“她让我笑，我偏不笑”，再加上背面那行很浅的铅笔年份，这张照片已经有故事了。我们就从翻到它的那个下午写起吧。',
      },
    ],
    actionCard: {
      gender: '女生',
      perspective: '以旁观者视角',
      protagonistName: '林晚',
    },
    versions: [
      {
        title: '夹进书页',
        content:
          '抽屉深处的合影被翻出来时，铅笔年份已经浅了。她认得那棵树的影子，却在自己的脸上停了一秒。照片重新进到书页里，像把某年夏天又轻轻合上。',
      },
      {
        title: '浅浅的年份',
        content:
          '旧物不必被解释。一张发黄的合影足够在某个普通下午，把人从当下拽走一寸，再轻轻放回来。树还在，人已经换了站法。',
      },
    ],
  },
]

export function getScriptById(id: string | null) {
  if (!id) return undefined
  return CREATE_SCRIPTS.find((script) => script.id === id)
}
