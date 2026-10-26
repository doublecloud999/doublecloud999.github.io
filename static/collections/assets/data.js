/* Java 集合体系交互图 · 数据层
   方法签名基准：javap -public（JDK 17.0.20），字段基准：javap -p，逐个核对过。
   字段一栏展示的是「源码级关键字段」，绝大多数是 private，不属于对外 API。 */

const LAYOUT = [
  { id: 'Collection', x: 600, y: 24 },
  { id: 'Set', x: 200, y: 112 },
  { id: 'List', x: 600, y: 112 },
  { id: 'Queue', x: 990, y: 112 },
  { id: 'HashSet', x: 120, y: 206 },
  { id: 'SortedSet', x: 330, y: 206 },
  { id: 'ArrayList', x: 520, y: 206 },
  { id: 'Vector', x: 700, y: 206 },
  { id: 'PriorityQueue', x: 880, y: 206 },
  { id: 'Deque', x: 1060, y: 206 },
  { id: 'LinkedHashSet', x: 170, y: 300 },
  { id: 'TreeSet', x: 400, y: 300 },
  { id: 'LinkedList', x: 620, y: 300 },
  { id: 'Stack', x: 790, y: 300 },
  { id: 'ArrayDeque', x: 1160, y: 300 },
  { id: 'Map', x: 380, y: 420 },
  { id: 'HashMap', x: 130, y: 514 },
  { id: 'Hashtable', x: 340, y: 514 },
  { id: 'SortedMap', x: 560, y: 514 },
  { id: 'LinkedHashMap', x: 170, y: 608 },
  { id: 'TreeMap', x: 640, y: 608 }
];

const EXTRA = [
  { id: 'Iterable', x: 130, y: 24, group: 'extra' },
  { id: 'Iterator', x: 250, y: 24, group: 'extra' },
  { id: 'Collections', x: 380, y: 24, group: 'extra' },
  { id: 'ConcurrentHashMap', x: 800, y: 24, group: 'extra' },
  { id: 'CopyOnWriteArrayList', x: 1000, y: 24, group: 'extra' },
  { id: 'LinkedBlockingQueue', x: 1200, y: 24, group: 'extra' }
];

const C = {
  'size()': '元素个数，不是容量',
  'isEmpty()': 'size() == 0',
  'contains(Object)': '依赖 equals；散列实现近 O(1)，链表 O(n)',
  'add(E)': '添加成功返回 true，失败/重复返回 false',
  'remove(Object)': '删除成功返回 true，不存在返回 false',
  'clear()': '清空元素，容量不缩',
  'iterator()': '返回迭代器，foreach 的底层就是它',
  'toArray()': '转成新数组，不改原集合',
  'containsAll(Collection)': '是否包含另一个集合的全部元素',
  'addAll(Collection)': '批量添加，有一个成功就返回 true',
  'removeAll(Collection)': '删掉与另一集合的交集',
  'retainAll(Collection)': '只保留交集，其余全删',
  'removeIf(Predicate)': 'JDK8，按条件批量删除',
  'stream()': '转 Stream，JDK8',
  'parallelStream()': '转并行流',
  'forEach(Consumer)': '遍历，来自 Iterable，JDK8',
  'equals(Object)': '逐元素比较，接口约定',
  'hashCode()': '与 equals 必须一致',
  'spliterator()': '并行遍历，一般不用手写'
};

const DB = {};

DB.Collection = {
  kind: 'iface',
  sub: '单列集合的根接口',
  tags: [['结构', '抽象接口'], ['实现', '9 个直接子类型'], ['方法', '20 个']],
  real: { ext: 'Iterable', impl: [] },
  intro: 'Collection 是「一组对象」的最高抽象，本身不能 new。它下面分三条路：List（有序可重复）、Set（不可重复）、Queue/Deque（排队进出）。Collection 继承自 Iterable，所以任何实现类都能用 foreach 和 stream。',
  fields: [['无实例字段', '接口', '接口不能有实例字段；一个常量都没有']],
  methods: [
    ['add(E)', '自身', 1, '可选操作，不可变集合上调用抛 UnsupportedOperationException'],
    ['remove(Object)', '自身', 1, '按 equals 找第一个并删除'],
    ['contains(Object)', '自身', 1, '按 equals 判断存在'],
    ['size()', '自身', 1, ''],
    ['isEmpty()', '自身', 0, ''],
    ['iterator()', '自身', 1, 'foreach 编译后就是调它'],
    ['clear()', '自身', 0, ''],
    ['toArray()', '自身', 0, ''],
    ['toArray(T[])', '自身', 0, '带类型数组，长度不够会新建'],
    ['containsAll(Collection)', '自身', 0, ''],
    ['addAll(Collection)', '自身', 1, ''],
    ['removeAll(Collection)', '自身', 0, ''],
    ['retainAll(Collection)', '自身', 0, ''],
    ['removeIf(Predicate)', '自身', 0, 'JDK8'],
    ['stream()', '自身', 0, ''],
    ['parallelStream()', '自身', 0, ''],
    ['equals(Object)', '自身', 0, ''],
    ['hashCode()', '自身', 0, ''],
    ['spliterator()', '自身', 0, '']
  ],
  grow: '接口没有扩容概念，扩容由实现类决定。',
  traps: [
    'Collection 没有 get(int)，按下标取值是 List 才有的能力',
    'add/remove 是「可选操作」，不可变集合（List.of、Collections.unmodifiableList）会直接抛异常',
    'Collection 和 Collections 是两个东西：前者是接口，后者是工具类'
  ],
  interview: [
    '为什么 Collection 不直接提供 get(int)？因为 Set/Queue 无法按下标寻址',
    'Collection 与 Iterable 的关系：Iterable 是父接口，只规定了能遍历'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/02_Collection集合'
};

DB.Set = {
  kind: 'iface',
  sub: '不可重复的集合',
  tags: [['约束', '元素唯一'], ['顺序', '不保证'], ['取值', '无下标']],
  real: { ext: 'Collection', impl: [] },
  intro: 'Set 只加一条约束：不允许重复元素。判断重复的标准由实现类决定——HashSet 看 hashCode + equals，TreeSet 看 compareTo/comparator 是否返回 0。因此 add 的返回值在 Set 上有额外含义：重复时返回 false。',
  fields: [['无实例字段', '接口', '约束靠实现类保证']],
  methods: [
    ['add(E)', '自身', 1, '重复元素返回 false，不会覆盖旧值'],
    ['remove(Object)', '自身', 1, ''],
    ['contains(Object)', '自身', 1, 'HashSet 是 O(1)，这是 Set 最常用的能力'],
    ['size()', '自身', 1, ''],
    ['of(E...)', '自身', 0, 'JDK9 静态工厂，不可变，且元素不能重复'],
    ['copyOf(Collection)', '自身', 0, 'JDK10，不可变副本'],
    ['iterator()', 'Collection', 0, ''],
    ['addAll(Collection)', 'Collection', 0, '自动去重'],
    ['retainAll(Collection)', 'Collection', 0, '求交集'],
    ['removeAll(Collection)', 'Collection', 0, '求差集'],
    ['toArray()', 'Collection', 0, ''],
    ['equals(Object)', 'Collection', 0, 'Set 的 equals 与顺序无关'],
    ['hashCode()', 'Collection', 0, '所有元素 hashCode 求和，所以与顺序无关']
  ],
  grow: '接口不涉及，看实现。',
  traps: [
    'Set.of(...) 传重复元素在运行时抛 IllegalArgumentException，不是去重',
    '元素塞进去之后再改参与 hash 的字段，contains 就找不到了',
    '不保证顺序 ≠ 随机顺序，HashSet 的顺序由 hash 决定，同一批数据每次一样'
  ],
  interview: [
    'Set 如何保证不重复？不是 Set 自己做的，是 HashMap 的 key 唯一性',
    'Set 和 List 的 equals 差异：Set 与顺序无关'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/01_集合继承关系机构图.docx'
};

DB.SortedSet = {
  kind: 'iface',
  sub: '带排序的 Set',
  tags: [['顺序', '按大小排'], ['依据', 'Comparable / Comparator'], ['专属', '范围查询']],
  real: { ext: 'Set', impl: [] },
  intro: 'SortedSet 在 Set 之上加了「有序」：元素按自然顺序或 Comparator 排列，因此能拿到首尾、能截取区间。截取出来的 headSet/tailSet/subSet 都是原集合的视图，改一个另一个跟着变。',
  fields: [['无实例字段', '接口', '']],
  methods: [
    ['comparator()', '自身', 1, '返回比较器；用自然序时返回 null'],
    ['first()', '自身', 1, '最小元素，空集合抛 NoSuchElementException'],
    ['last()', '自身', 1, '最大元素'],
    ['headSet(E)', '自身', 1, '小于 toElement 的部分，左闭右开'],
    ['tailSet(E)', '自身', 1, '大于等于 fromElement 的部分'],
    ['subSet(E, E)', '自身', 1, '左闭右开的区间视图'],
    ['add(E)', 'Set', 0, '按比较结果判重，compare 返回 0 就算重复'],
    ['contains(Object)', 'Set', 0, 'O(log n)'],
    ['iterator()', 'Set', 0, '按排序顺序遍历']
  ],
  grow: '看实现，TreeSet 走红黑树，没有扩容概念。',
  traps: [
    '三个范围方法返回的是视图，不是副本，改视图等于改原集合',
    '往里加不可比较的元素抛 ClassCastException，而且可能在 add 时才炸'
  ],
  interview: ['TreeSet 怎么判断元素重复？compareTo 返回 0，而不是 equals'],
  doc: 'JavaSE进阶/第七章 集合/集合_01/05_Map集合/06_TreeSet.docx'
};

DB.List = {
  kind: 'iface',
  sub: '有序、可重复、带下标',
  tags: [['顺序', '插入序'], ['下标', '0 起步'], ['重复', '允许']],
  real: { ext: 'Collection', impl: [] },
  intro: 'List 是最常用的集合接口。它在 Collection 之上补了两样东西：按下标访问（get/set/indexOf）和按位置插入。有了下标，就有了 remove(int) 和 remove(Object) 这对容易踩坑的重载。',
  fields: [['无实例字段', '接口', '']],
  methods: [
    ['get(int)', '自身', 1, 'ArrayList O(1)，LinkedList O(n)'],
    ['set(int, E)', '自身', 1, '替换并返回旧值'],
    ['add(int, E)', '自身', 1, '在 index 处插入，后面全部右移'],
    ['remove(int)', '自身', 1, '按位置删，返回被删元素'],
    ['indexOf(Object)', '自身', 1, '首次出现的下标，找不到 -1'],
    ['lastIndexOf(Object)', '自身', 1, '最后一次出现的下标'],
    ['subList(int, int)', '自身', 1, '左闭右开的视图，不是副本'],
    ['listIterator()', '自身', 1, '双向迭代，能边走边 set/add'],
    ['listIterator(int)', '自身', 0, '从指定位置开始'],
    ['sort(Comparator)', '自身', 1, 'JDK8，底层 Arrays.sort，稳定排序'],
    ['replaceAll(UnaryOperator)', '自身', 0, '每个元素过一遍函数'],
    ['addAll(int, Collection)', '自身', 0, '在指定位置批量插入'],
    ['of(E...)', '自身', 0, 'JDK9 不可变，长度固定，元素不能为 null'],
    ['copyOf(Collection)', '自身', 0, 'JDK10 不可变副本'],
    ['add(E)', 'Collection', 1, '尾部追加'],
    ['remove(Object)', 'Collection', 1, '坑：remove(1) 走的是 remove(int)'],
    ['contains(Object)', 'Collection', 0, 'O(n)，靠 equals 逐个比'],
    ['iterator()', 'Collection', 0, ''],
    ['size()', 'Collection', 0, ''],
    ['clear()', 'Collection', 0, ''],
    ['containsAll(Collection)', 'Collection', 0, ''],
    ['removeAll(Collection)', 'Collection', 0, ''],
    ['retainAll(Collection)', 'Collection', 0, '']
  ],
  grow: '接口不涉及。',
  traps: [
    'remove(1) 删的是下标 1；想删元素 1 得写 remove(Integer.valueOf(1))',
    'subList 是视图，对原 List 做结构修改后再用 subList 会抛 ConcurrentModificationException',
    'Arrays.asList 返回的是定长 List，add/remove 抛 UnsupportedOperationException，但 set 可以',
    'List.of 完全不可变，连 set 都不行，且不接受 null'
  ],
  interview: [
    'ArrayList 和 LinkedList 什么时候选哪个（看是随机访问多还是头尾增删多，实际项目里 ArrayList 基本通吃）',
    'List 的 equals 有顺序要求，Set 没有'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/03_List集合/01_List集合特有方法.docx'
};

DB.Queue = {
  kind: 'iface',
  sub: '队列：先进先出',
  tags: [['顺序', 'FIFO'], ['两套方法', '抛异常 / 返特殊值'], ['null', '多数不允许']],
  real: { ext: 'Collection', impl: [] },
  intro: 'Queue 的六个方法分成三对，每对做同一件事但出错时的行为不同：add/remove/element 出错直接抛异常，offer/poll/peek 出错返回 false 或 null。生产代码里基本用后一套，因为不需要靠异常控流程。',
  fields: [['无实例字段', '接口', '']],
  methods: [
    ['offer(E)', '自身', 1, '入队，失败返回 false（有界队列满了）'],
    ['poll()', '自身', 1, '出队，空队列返回 null，不抛异常'],
    ['peek()', '自身', 1, '看队头不出队，空返回 null'],
    ['add(E)', '自身', 1, '入队，失败抛 IllegalStateException'],
    ['remove()', '自身', 1, '出队，空队列抛 NoSuchElementException'],
    ['element()', '自身', 1, '看队头，空抛异常'],
    ['size()', 'Collection', 0, ''],
    ['contains(Object)', 'Collection', 0, 'LinkedList 是 O(n)']
  ],
  grow: '接口不涉及。',
  traps: [
    'poll 返回 null 无法区分「空队列」和「队头本来就是 null」，所以 ArrayDeque 干脆禁止 null',
    'PriorityQueue 是 Queue 但不是 FIFO，出队顺序按优先级'
  ],
  interview: ['add 和 offer 的区别 / remove 和 poll 的区别（一句话：出错抛异常还是返特殊值）'],
  doc: '数据结构与算法/一刷代码随想录/09_栈与队列.docx'
};

DB.Deque = {
  kind: 'iface',
  sub: '双端队列，也能当栈用',
  tags: [['两端', '都能进出'], ['当栈', 'push/pop'], ['当队列', 'offer/poll']],
  real: { ext: 'Queue', impl: [] },
  intro: 'Deque 是「双端队列」，两端都能进出，所以它同时能当队列（FIFO）和栈（LIFO）。JDK 官方推荐用它替代 Stack：ArrayDeque 比 Stack 快，而且不暴露按下标访问。',
  fields: [['无实例字段', '接口', '']],
  methods: [
    ['addFirst(E)', '自身', 1, '头部插入，失败抛异常'],
    ['addLast(E)', '自身', 1, '尾部插入，等价于 add'],
    ['offerFirst(E)', '自身', 1, '头部插入，失败返回 false'],
    ['offerLast(E)', '自身', 0, ''],
    ['push(E)', '自身', 1, '= addFirst，栈语义入栈'],
    ['pop()', '自身', 1, '= removeFirst，栈语义出栈，空则抛异常'],
    ['removeFirst()', '自身', 1, '头部删除，空抛异常'],
    ['removeLast()', '自身', 1, '尾部删除，空抛异常'],
    ['pollFirst()', '自身', 1, '头部删除，空返回 null'],
    ['pollLast()', '自身', 1, '尾部删除，空返回 null'],
    ['peekFirst()', '自身', 1, '看头部，空返回 null'],
    ['peekLast()', '自身', 1, '看尾部'],
    ['getFirst()', '自身', 0, '看头部，空抛异常'],
    ['getLast()', '自身', 0, ''],
    ['descendingIterator()', '自身', 0, '逆序遍历'],
    ['removeFirstOccurrence(Object)', '自身', 0, '删掉第一个匹配的'],
    ['removeLastOccurrence(Object)', '自身', 0, '删掉最后一个匹配的'],
    ['offer(E)', 'Queue', 0, '= offerLast'],
    ['poll()', 'Queue', 0, '= pollFirst'],
    ['peek()', 'Queue', 0, '= peekFirst']
  ],
  grow: '接口不涉及，ArrayDeque 是 2 的幂扩容翻倍。',
  traps: [
    'push/pop 对应的是头部，别和 addLast/pollLast 混',
    'Deque 的 iterator 是从头往尾走；作为栈用时，遍历顺序是「栈底到栈顶」'
  ],
  interview: ['为什么 Stack 被标记为不推荐？因为它继承 Vector，能按下标乱插，破坏了栈的封装'],
  doc: '数据结构与算法/一刷代码随想录/10_Deque.docx'
};

DB.Map = {
  kind: 'iface',
  sub: '键值对集合，键唯一',
  tags: [['结构', 'key → value'], ['键', '唯一，可 null（看实现）'], ['不是 Collection']],
  real: { ext: '无（独立根接口）', impl: [] },
  intro: 'Map 不在 Collection 这棵树上，它是独立的根接口——因为它存的是键值对而不是单个元素。三个视图最关键：keySet()、values()、entrySet()，三者都是原 Map 的视图，改它们等于改 Map。遍历时 entrySet 最快，keySet 再 get 等于白白多查一次。',
  fields: [['无实例字段', '接口', 'Map.Entry 是它的内部接口，代表一对键值']],
  methods: [
    ['put(K, V)', '自身', 1, '返回被覆盖的旧值；原来没这个 key 返回 null'],
    ['get(Object)', '自身', 1, '找不到返回 null，注意和「值是 null」区分不开'],
    ['remove(Object)', '自身', 1, '返回被删的 value'],
    ['containsKey(Object)', '自身', 1, 'O(1)，优先用它而不是 get()!=null'],
    ['containsValue(Object)', '自身', 1, 'O(n)，遍历所有值'],
    ['getOrDefault(Object, V)', '自身', 1, 'JDK8，找不到返回默认值'],
    ['putIfAbsent(K, V)', '自身', 1, 'JDK8，key 不存在才放'],
    ['computeIfAbsent(K, Function)', '自身', 1, 'JDK8，分组统计的常用写法'],
    ['computeIfPresent(K, BiFunction)', '自身', 0, 'JDK8'],
    ['compute(K, BiFunction)', '自身', 0, 'JDK8'],
    ['merge(K, V, BiFunction)', '自身', 1, 'JDK8，计数神器 map.merge(k,1,Integer::sum)'],
    ['keySet()', '自身', 1, '所有键的 Set 视图'],
    ['values()', '自身', 1, '所有值的 Collection 视图，不是 Set，值可重复'],
    ['entrySet()', '自身', 1, '键值对集合，遍历效率最高'],
    ['forEach(BiConsumer)', '自身', 0, 'JDK8'],
    ['replaceAll(BiFunction)', '自身', 0, 'JDK8'],
    ['replace(K, V)', '自身', 0, 'JDK8，key 存在才替换'],
    ['size()', '自身', 1, '键值对个数'],
    ['isEmpty()', '自身', 0, ''],
    ['clear()', '自身', 0, ''],
    ['putAll(Map)', '自身', 0, ''],
    ['of(K, V, ...)', '自身', 0, 'JDK9，最多 10 对，不可变，key/value 不能为 null'],
    ['entry(K, V)', '自身', 0, 'JDK9，造一个 Entry'],
    ['copyOf(Map)', '自身', 0, 'JDK10']
  ],
  grow: '接口不涉及，HashMap 扩容 2 倍。',
  traps: [
    'get 返回 null 分不清「没这个 key」和「值是 null」，要判断存在必须用 containsKey',
    'keySet 遍历再 get，是两次查找；entrySet 一次搞定',
    '三个视图都是活的，删 Map 里的东西视图跟着变；反过来删视图也会删 Map',
    'Map.of 的 key 不能重复，重复抛 IllegalArgumentException'
  ],
  interview: [
    'HashMap / Hashtable / TreeMap / LinkedHashMap 的区别',
    '为什么 Map 不继承 Collection',
    '遍历 Map 的三种方式和性能差异'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/05_Map集合/01_Map的常用方法和遍历.docx'
};

DB.SortedMap = {
  kind: 'iface',
  sub: '按 key 排序的 Map',
  tags: [['顺序', '按 key 排'], ['专属', '范围查询'], ['实现', 'TreeMap']],
  real: { ext: 'Map', impl: [] },
  intro: 'SortedMap 要求 key 可比较，整张表按 key 排序，因此多了首尾键和区间截取。区间视图同样是活的：subMap 改一处，原 Map 跟着变。',
  fields: [['无实例字段', '接口', '']],
  methods: [
    ['comparator()', '自身', 1, '自然序返回 null'],
    ['firstKey()', '自身', 1, '最小 key，空抛 NoSuchElementException'],
    ['lastKey()', '自身', 1, '最大 key'],
    ['headMap(K)', '自身', 1, '小于 toKey 的部分'],
    ['tailMap(K)', '自身', 1, '大于等于 fromKey 的部分'],
    ['subMap(K, K)', '自身', 1, '左闭右开'],
    ['put(K, V)', 'Map', 0, 'O(log n)，红黑树插入'],
    ['get(Object)', 'Map', 0, 'O(log n)'],
    ['entrySet()', 'Map', 0, '按 key 升序']
  ],
  grow: '看实现，TreeMap 无扩容。',
  traps: ['往 SortedMap 里塞不可比较的 key 抛 ClassCastException', 'headMap/tailMap/subMap 都是视图'],
  interview: ['TreeMap 的 get 为什么是 O(log n) 而不是 O(1)'],
  doc: 'JavaSE进阶/第七章 集合/集合_01/05_Map集合/06_TreeSet.docx'
};

DB.HashSet = {
  kind: 'class',
  sub: '哈希表实现的无序集合',
  tags: [['底层', 'HashMap'], ['线程', '不安全'], ['查找', 'O(1)']],
  real: { ext: 'AbstractSet', impl: ['Set', 'Cloneable', 'Serializable'] },
  intro: 'HashSet 自己几乎没写逻辑，就是一个 HashMap 的空壳：元素当 key，value 统一塞一个假的 Object 常量。所以 HashSet 的一切特性都是 HashMap 的特性——无序、O(1) 查找、按 hashCode 分布、默认 16 容量 0.75 负载因子。',
  fields: [
    ['HashMap<E,Object> map', 'private transient', '真正的存储容器，元素是 key'],
    ['Object PRESENT', 'private static final', '所有 value 共用的占位对象，纯粹为了凑成键值对']
  ],
  methods: [
    ['add(E)', '自身', 1, 'return map.put(e, PRESENT) == null，所以重复返回 false'],
    ['remove(Object)', '自身', 1, 'return map.remove(o) == PRESENT'],
    ['contains(Object)', '自身', 1, 'O(1)，先比 hash 再比 equals'],
    ['iterator()', '自身', 1, 'HashMap 的 keySet().iterator()，遍历顺序由 hash 决定'],
    ['size()', '自身', 0, ''],
    ['isEmpty()', '自身', 0, ''],
    ['clear()', '自身', 0, ''],
    ['clone()', '自身', 0, '浅拷贝，元素本身不复制'],
    ['spliterator()', '自身', 0, ''],
    ['toArray()', '自身', 0, ''],
    ['toArray(T[])', '自身', 0, ''],
    ['HashSet()', '构造', 1, '默认 16 / 0.75'],
    ['HashSet(int, float)', '构造', 1, '前两个参数是期望容量和负载因子'],
    ['HashSet(Collection)', '构造', 0, '常用于去重：new HashSet<>(list)'],
    ['containsAll(Collection)', 'Set', 0, ''],
    ['addAll(Collection)', 'Collection', 0, '批量加，自动去重']
  ],
  grow: '实际扩容由内部 HashMap 负责：16 起步，元素数超过 容量×0.75 就翻倍并重新散列。想要 1000 个元素不扩容，new HashSet<>(1024) 比 new HashSet<>() 好，但别写死，容量不为 2 的幂时会被向上取整。',
  traps: [
    'HashSet 的「无序」是稳定的无序：同一批数据、同样的哈希算法，遍历顺序每次一样，但和插入顺序无关',
    '对象存进去之后又修改了参与 hashCode 的字段，等于自己把自己弄丢了，contains 会返回 false',
    '重写 equals 必须重写 hashCode，否则两个「相等」的对象落在不同桶里，HashSet 会认为是两个'
  ],
  interview: [
    'HashSet 怎么保证不重复？（Map.put 的 key 唯一性）',
    '为什么 HashSet 没有 get(int)？',
    'HashSet 的初始容量和负载因子是多少，什么时候扩容'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/05_Map集合/03_hashcode和equals重写.docx'
};

DB.LinkedHashSet = {
  kind: 'class',
  sub: '能记住插入顺序的 HashSet',
  tags: [['底层', 'LinkedHashMap'], ['顺序', '插入序'], ['代价', '多一层链表']],
  real: { ext: 'HashSet', impl: ['Set', 'Cloneable', 'Serializable'] },
  intro: 'LinkedHashSet 只做了一件事：把所有构造方法都改成创建 LinkedHashMap。于是它在哈希表之外多挂了一条双向链表，记住每个元素进来的先后。查找仍是 O(1)，只是每个元素多两个指针的内存开销。',
  fields: [['无自有字段', '继承', '复用 HashSet.map，只是运行时是 LinkedHashMap']],
  methods: [
    ['LinkedHashSet()', '构造', 1, '内部 new LinkedHashMap，默认插入序'],
    ['LinkedHashSet(int, float)', '构造', 0, '指定容量和负载因子'],
    ['LinkedHashSet(Collection)', '构造', 0, '带顺序的拷贝'],
    ['add(E)', 'HashSet', 1, '同 HashSet，只是同时挂到链表尾部'],
    ['iterator()', 'HashSet', 1, '按插入顺序遍历，这是它存在的唯一理由'],
    ['remove(Object)', 'HashSet', 0, ''],
    ['contains(Object)', 'HashSet', 0, '']
  ],
  grow: '同 HashMap，16 起步 0.75 翻倍；链表节点不影响扩容判断。',
  traps: [
    '它只有插入序，没有访问序。需要 LRU 那种「访问过的挪到尾部」必须用 LinkedHashMap(16, 0.75f, true)',
    '想按插入顺序去重的标准写法就是 new LinkedHashSet<>(list)，比 stream().distinct() 可读',
    '重复元素再 add 一次不会改变它原来的位置'
  ],
  interview: ['LinkedHashSet 和 HashSet 的区别，以及它为什么能保证顺序'],
  doc: 'JavaSE进阶/第七章 集合/集合_01/01_集合继承关系机构图.docx'
};

DB.TreeSet = {
  kind: 'class',
  sub: '红黑树实现的有序集合',
  tags: [['底层', 'TreeMap / 红黑树'], ['顺序', '按大小'], ['复杂度', 'O(log n)']],
  real: { ext: 'AbstractSet', impl: ['NavigableSet', 'Cloneable', 'Serializable'] },
  intro: 'TreeSet 底层是一个 TreeMap，元素当 key，value 是占位常量——和 HashSet 包 HashMap 的套路一模一样，只是换成红黑树。所以它自动去重且有序，代价是所有操作从 O(1) 掉到 O(log n)。',
  fields: [
    ['NavigableMap<E,Object> m', 'private transient', '实际存数据的 TreeMap'],
    ['Object PRESENT', 'private static final', '占位 value，与 HashSet 相同']
  ],
  methods: [
    ['TreeSet()', '构造', 1, '自然序，要求元素实现 Comparable'],
    ['TreeSet(Comparator)', '构造', 1, '自定义比较器，元素可以不实现 Comparable'],
    ['TreeSet(Collection)', '构造', 0, '批量构造，构造时排序'],
    ['TreeSet(SortedSet)', '构造', 0, '沿用对方的比较器'],
    ['add(E)', '自身', 1, 'compare 返回 0 视为重复，add 返回 false'],
    ['first()', '自身', 1, '最小值'],
    ['last()', '自身', 1, '最大值'],
    ['ceiling(E)', '自身', 1, '大于等于 e 的最小元素，没有返回 null'],
    ['floor(E)', '自身', 1, '小于等于 e 的最大元素'],
    ['higher(E)', '自身', 1, '严格大于 e 的最小元素'],
    ['lower(E)', '自身', 1, '严格小于 e 的最大元素'],
    ['headSet(E)', '自身', 1, '左闭右开视图'],
    ['tailSet(E)', '自身', 1, '左闭视图'],
    ['subSet(E, E)', '自身', 1, '区间视图，改它会改原集合'],
    ['headSet(E, boolean)', '自身', 0, '第二个参数控制是否包含端点'],
    ['tailSet(E, boolean)', '自身', 0, ''],
    ['subSet(E, boolean, E, boolean)', '自身', 0, '两端都能控开闭'],
    ['pollFirst()', '自身', 1, '取出并删除最小值'],
    ['pollLast()', '自身', 1, '取出并删除最大值'],
    ['descendingSet()', '自身', 0, '倒序视图'],
    ['descendingIterator()', '自身', 0, '倒序遍历'],
    ['comparator()', '自身', 0, '自然序返回 null'],
    ['iterator()', '自身', 0, '升序遍历'],
    ['contains(Object)', '自身', 0, 'O(log n)'],
    ['size()', '自身', 0, ''],
    ['isEmpty()', '自身', 0, ''],
    ['clear()', '自身', 0, ''],
    ['addAll(Collection)', '自身', 0, ''],
    ['clone()', '自身', 0, '浅拷贝']
  ],
  grow: '红黑树没有扩容，只有旋转和变色。',
  traps: [
    'TreeSet 用 compareTo 判重，不是 equals。两个对象 equals 为 false 但 compareTo 返回 0，第二个会被当成重复扔掉',
    'add(null) 在默认自然序下抛 NullPointerException',
    '放进去的对象如果参与比较的字段被修改，树的结构就乱了，之后的查找可能失效',
    '自定义 Comparator 时注意：compare 里减法的整数溢出（写 Integer.compare(a, b)，别写 a - b）'
  ],
  interview: [
    'TreeSet 怎么排序、怎么判重',
    'TreeSet / HashSet / LinkedHashSet 三者怎么选',
    '红黑树和 AVL 树的区别'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/05_Map集合/07_TreeSet_排序.docx'
};

DB.ArrayList = {
  kind: 'class',
  sub: '动态数组，随机访问最快',
  tags: [['底层', 'Object[] 数组'], ['线程', '不安全'], ['随机访问', 'O(1)']],
  real: { ext: 'AbstractList', impl: ['List', 'RandomAccess', 'Cloneable', 'Serializable'] },
  intro: 'ArrayList 就是一个会自己长大的数组。elementData 装元素，size 记用了多少格。满了按 1.5 倍扩容，把老数组整个复制过去——所以「扩容」才是它的主要开销，而不是 add 本身。随机访问 O(1)，中间插入删除 O(n)。',
  fields: [
    ['Object[] elementData', 'transient', '真正装元素的数组，容量就是它的 length'],
    ['int size', 'private', '已用格子数，不是数组长度'],
    ['int DEFAULT_CAPACITY = 10', 'private static final', '默认容量，注意不是 new 的时候就有 10'],
    ['Object[] EMPTY_ELEMENTDATA', 'private static final', 'new ArrayList(0) 用这个空数组'],
    ['Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA', 'private static final', 'new ArrayList() 用这个，第一次 add 才扩到 10'],
    ['int modCount', '继承自 AbstractList', '结构修改次数，迭代器的 fail-fast 靠它']
  ],
  methods: [
    ['add(E)', '自身', 1, '尾部追加，先 ensureCapacity 再放，均摊 O(1)'],
    ['get(int)', '自身', 1, '下标检查后直接数组取值，O(1)'],
    ['set(int, E)', '自身', 1, '替换并返回旧值，O(1)'],
    ['add(int, E)', '自身', 1, 'System.arraycopy 整体右移，O(n)'],
    ['remove(int)', '自身', 1, '取走后整体左移，O(n)，这是它最慢的地方'],
    ['remove(Object)', '自身', 1, '先 indexOf 找下标，再 remove(int)，两次遍历'],
    ['indexOf(Object)', '自身', 1, '从头 equals 比，O(n)'],
    ['lastIndexOf(Object)', '自身', 0, '从尾往前找'],
    ['subList(int, int)', '自身', 1, '返回视图，不是新集合'],
    ['sort(Comparator)', '自身', 1, 'Arrays.sort，TimSort，稳定'],
    ['forEach(Consumer)', '自身', 0, ''],
    ['removeIf(Predicate)', '自身', 0, '批量条件删除，内部用位图标记再一次性移动'],
    ['replaceAll(UnaryOperator)', '自身', 0, ''],
    ['ensureCapacity(int)', '自身', 1, '预分配，批量 add 前调它能省掉多次扩容'],
    ['trimToSize()', '自身', 1, '把数组缩到刚好 size，省内存'],
    ['clone()', '自身', 0, '浅拷贝，新数组但元素共享'],
    ['iterator()', '自身', 0, 'Itr，遍历时 remove 是唯一安全的修改'],
    ['listIterator()', '自身', 0, 'ListItr，支持双向和 set'],
    ['size()', '自身', 0, '返回 size 字段'],
    ['isEmpty()', '自身', 0, ''],
    ['contains(Object)', '自身', 0, 'O(n)'],
    ['clear()', '自身', 0, '遍历置 null 帮 GC，size 归零但容量不动'],
    ['addAll(Collection)', '自身', 0, ''],
    ['addAll(int, Collection)', '自身', 0, ''],
    ['removeAll(Collection)', '自身', 0, ''],
    ['retainAll(Collection)', '自身', 0, ''],
    ['toArray()', '自身', 0, ''],
    ['toArray(T[])', '自身', 0, ''],
    ['ArrayList()', '构造', 1, '空数组，第一次 add 才变成容量 10'],
    ['ArrayList(int)', '构造', 1, '指定初始容量，知道大概数量时用它'],
    ['ArrayList(Collection)', '构造', 0, '把别的集合拷进来，常用于复制']
  ],
  grow: '扩容公式：newCapacity = oldCapacity + (oldCapacity >> 1)，即 1.5 倍，且向上取到够用。第一次 add 走默认容量 10。扩容 = Arrays.copyOf 整段复制，所以「能预估数量就 new ArrayList<>(n)」不是洁癖，是实打实的性能。',
  traps: [
    'remove(1) 删下标 1，不是删元素 1（自动装箱走 remove(Object) 要显式写 Integer.valueOf(1)）',
    'for 循环里 ArrayList.remove 会导致下标错位+漏删，用倒序或 iterator.remove',
    '遍历中 add/remove 抛 ConcurrentModificationException，就算单线程也一样',
    'subList 返回的是内部类视图，原 List 结构一变，之前的 subList 立刻失效',
    '多线程同时 add 会丢数据，甚至数组越界'
  ],
  interview: [
    'ArrayList 扩容机制，为什么是 1.5 倍而不是 2 倍（1.5 更容易复用之前释放的内存块）',
    'new ArrayList<>() 和 new ArrayList<>(0) 的区别',
    'ArrayList 和数组、和 LinkedList 的取舍',
    '怎么在遍历中安全删除元素'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/03_List集合/02_01_ArrayList集合扩容原理.docx'
};

DB.LinkedList = {
  kind: 'class',
  sub: '双向链表，同时是 List 和 Deque',
  tags: [['底层', '双向链表'], ['头尾操作', 'O(1)'], ['随机访问', 'O(n)']],
  real: { ext: 'AbstractSequentialList', impl: ['List', 'Deque', 'Cloneable', 'Serializable'] },
  intro: 'LinkedList 是双向链表，first/last 指着头尾，每个 Node 存 item + next + prev。它在图上同时挂在 List 和 Deque 下面，所以既能当下标列表用，也能当队列/栈用。但按下标访问要先从头或尾走一半，实际项目里很少拿它当 List。',
  fields: [
    ['Node<E> first', 'transient', '头节点，空链表为 null'],
    ['Node<E> last', 'transient', '尾节点'],
    ['int size', 'transient', '节点个数'],
    ['static class Node<E>', 'private', 'item + next + prev，每个元素一个对象']
  ],
  methods: [
    ['addFirst(E)', '自身', 1, '头插，O(1)'],
    ['addLast(E)', '自身', 1, '尾插，O(1)，等价于 add'],
    ['getFirst()', '自身', 1, '空链表抛 NoSuchElementException'],
    ['getLast()', '自身', 1, '同上'],
    ['removeFirst()', '自身', 1, '空链表抛异常'],
    ['removeLast()', '自身', 1, '空链表抛异常'],
    ['get(int)', '自身', 1, 'index < size/2 从头走，否则从尾走，O(n)'],
    ['add(int, E)', '自身', 1, '先找到位置节点，再改指针，找位置本身 O(n)'],
    ['remove(int)', '自身', 1, 'O(n) 找位置 + O(1) 摘链'],
    ['remove(Object)', '自身', 0, '从头找，O(n)'],
    ['push(E)', '自身', 1, '= addFirst，栈语义'],
    ['pop()', '自身', 1, '= removeFirst'],
    ['offer(E)', '自身', 0, '= addLast'],
    ['poll()', '自身', 0, '= 删头，空返回 null'],
    ['peek()', '自身', 0, '= 看头，空返回 null'],
    ['offerFirst(E)', '自身', 0, ''],
    ['offerLast(E)', '自身', 0, ''],
    ['pollFirst()', '自身', 0, ''],
    ['pollLast()', '自身', 0, ''],
    ['peekFirst()', '自身', 0, ''],
    ['peekLast()', '自身', 0, ''],
    ['element()', '自身', 0, '= getFirst，空抛异常'],
    ['remove()', '自身', 0, '= removeFirst，空抛异常'],
    ['removeFirstOccurrence(Object)', '自身', 0, ''],
    ['removeLastOccurrence(Object)', '自身', 0, ''],
    ['descendingIterator()', '自身', 0, '从尾往头遍历'],
    ['set(int, E)', 'List', 0, 'O(n) 找位置后改 item'],
    ['indexOf(Object)', 'List', 0, ''],
    ['listIterator(int)', 'List', 0, ''],
    ['size()', '自身', 0, '返回字段，O(1)'],
    ['contains(Object)', '自身', 0, 'O(n)'],
    ['addAll(Collection)', '自身', 0, ''],
    ['clear()', '自身', 0, '遍历断开所有 next/prev 引用'],
    ['clone()', '自身', 0, '浅拷贝'],
    ['LinkedList()', '构造', 0, '空链表'],
    ['LinkedList(Collection)', '构造', 0, '']
  ],
  grow: '链表没有扩容，来一个节点挂一个，内存是散的。',
  traps: [
    'LinkedList 做「列表」几乎永远比 ArrayList 慢：链表节点分散在堆上，CPU 缓存命中率极低',
    '拿它当队列用也不如 ArrayDeque',
    'for (int i=0; i<list.size(); i++) list.get(i) 在 LinkedList 上是 O(n²)，要用迭代器或 foreach',
    '每个元素额外 2 个引用 + 1 个对象头，内存开销比 ArrayList 大好几倍'
  ],
  interview: [
    'ArrayList 与 LinkedList 的真实差异（别只背「数组 vs 链表」，要提缓存局部性）',
    'LinkedList 为什么实现了 Deque',
    '什么场景下 LinkedList 才真的有优势（头尾频繁增删、不需要随机访问）'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/03_List集合/04_Linkedlist源码分析.docx'
};

DB.Vector = {
  kind: 'class',
  sub: '同步的老式动态数组',
  tags: [['底层', '数组'], ['线程', '方法级 synchronized'], ['状态', '不推荐使用']],
  real: { ext: 'AbstractList', impl: ['List', 'RandomAccess', 'Cloneable', 'Serializable'] },
  intro: 'Vector 是 JDK 1.0 就有的类，比集合框架还早。它和 ArrayList 结构几乎一样，区别是所有方法都加了 synchronized，扩容默认翻倍而不是 1.5 倍。现在已被标记为「不推荐」，因为方法级加锁粒度太粗，复合操作照样不安全。',
  fields: [
    ['Object[] elementData', 'protected', '存元素的数组，子类能直接访问（Stack 就用了）'],
    ['int elementCount', 'protected', '已用元素数'],
    ['int capacityIncrement', 'protected', '扩容增量；为 0 时按 2 倍扩容']
  ],
  methods: [
    ['add(E)', '自身', 1, 'synchronized，等价于 addElement'],
    ['elementAt(int)', '自身', 1, '老 API 版的 get'],
    ['get(int)', '自身', 1, 'synchronized'],
    ['capacity()', '自身', 1, '当前容量，不是元素数'],
    ['elements()', '自身', 1, '返回 Enumeration，比 Iterator 更老的遍历接口'],
    ['addElement(E)', '自身', 1, '老 API，等价于 add'],
    ['removeElement(Object)', '自身', 0, '老 API'],
    ['firstElement()', '自身', 0, ''],
    ['lastElement()', '自身', 0, ''],
    ['setSize(int)', '自身', 0, '直接改元素数，多出来的位置填 null'],
    ['insertElementAt(E, int)', '自身', 0, ''],
    ['removeElementAt(int)', '自身', 0, ''],
    ['setElementAt(E, int)', '自身', 0, ''],
    ['removeAllElements()', '自身', 0, '= clear'],
    ['copyInto(Object[])', '自身', 0, '拷贝到给定数组'],
    ['trimToSize()', '自身', 0, '缩容到刚好'],
    ['ensureCapacity(int)', '自身', 0, ''],
    ['Vector()', '构造', 1, '默认容量 10'],
    ['Vector(int, int)', '构造', 0, '第二个参数是扩容增量'],
    ['size()', '自身', 0, 'synchronized'],
    ['iterator()', '自身', 0, '迭代器本身不是线程安全的']
  ],
  grow: '扩容规则：有 capacityIncrement 就加它，没有就翻倍（和 ArrayList 的 1.5 倍不同）。',
  traps: [
    '每个方法都 synchronized ≠ 线程安全：if (!v.contains(x)) v.add(x) 这种复合操作照样有竞态',
    '迭代时其他线程修改会抛 ConcurrentModificationException',
    '现在要线程安全用 CopyOnWriteArrayList 或 Collections.synchronizedList，别用 Vector'
  ],
  interview: ['Vector 和 ArrayList 的区别（同步、扩容倍数、历史年代）', '为什么同步容器不保证复合操作安全'],
  doc: 'JavaSE进阶/第七章 集合/集合_01/03_List集合/05_Vector.docx'
};

DB.Stack = {
  kind: 'class',
  sub: '栈：后进先出',
  tags: [['底层', '继承 Vector'], ['顺序', 'LIFO'], ['状态', '不推荐使用']],
  real: { ext: 'Vector', impl: [] },
  intro: 'Stack 是 JDK 1.0 的栈，直接继承 Vector，push 就是 addElement，pop 就是取末尾。问题也在这：继承了 Vector 就继承了「按下标随便插」的能力，栈的封装被破坏；而且所有操作都带锁。官方现在推荐用 ArrayDeque 当栈。',
  fields: [['无自有字段', '继承', '用父类 Vector 的 elementData / elementCount']],
  methods: [
    ['push(E)', '自身', 1, '入栈，返回入栈的元素（不是 void）'],
    ['pop()', '自身', 1, '出栈并删除栈顶，空栈抛 EmptyStackException'],
    ['peek()', '自身', 1, '只看栈顶不删，空栈抛异常'],
    ['empty()', '自身', 1, '注意方法名是 empty 不是 isEmpty'],
    ['search(Object)', '自身', 1, '返回从栈顶算起的 1 基下标，找不到返回 -1'],
    ['size()', 'Vector', 0, ''],
    ['get(int)', 'Vector', 0, '能按下标取，这正是不该有的能力']
  ],
  grow: '同 Vector：默认 10，满了翻倍。',
  traps: [
    '空栈时 peek/pop 抛的是 EmptyStackException，不是 NoSuchElementException',
    'search 返回 1 表示栈顶，容易和数组下标搞混',
    '替代方案：Deque<Integer> s = new ArrayDeque<>()，用 push/pop/peek，性能更好'
  ],
  interview: ['Stack 为什么不推荐，替代品是什么', '用两个栈实现队列 / 用队列实现栈（手撕高频）'],
  doc: '数据结构与算法/一刷代码随想录/09_栈与队列.docx'
};

DB.PriorityQueue = {
  kind: 'class',
  sub: '二叉堆实现的优先队列',
  tags: [['底层', '数组存二叉堆'], ['队头', '最小（默认）'], ['线程', '不安全']],
  real: { ext: 'AbstractQueue', impl: ['Queue', 'Serializable'] },
  intro: 'PriorityQueue 不是先进先出，是「优先级最高的先出」。底层是一个数组表示的完全二叉堆，默认小顶堆：poll 拿到的永远是最小元素。入队出队都是 O(log n)，只有堆顶是 O(1)。它不保证遍历顺序——iterator 出来的顺序是数组顺序，不是排序结果。',
  fields: [
    ['Object[] queue', 'transient', '堆数组，queue[0] 是堆顶'],
    ['int size', 'private', '元素个数'],
    ['Comparator<? super E> comparator', 'private final', '为 null 时用元素的自然顺序'],
    ['int DEFAULT_INITIAL_CAPACITY = 11', 'private static final', '默认初始容量，注意是 11 不是 16'],
    ['int modCount', 'transient', 'fail-fast 计数']
  ],
  methods: [
    ['offer(E)', '自身', 1, '入堆，上浮调整，O(log n)；null 抛 NPE'],
    ['add(E)', '自身', 1, '内部就是 offer'],
    ['poll()', '自身', 1, '取堆顶并下沉调整，O(log n)，空返回 null'],
    ['peek()', '自身', 1, '看堆顶，O(1)，空返回 null'],
    ['remove(Object)', '自身', 1, 'O(n) 找到 + O(log n) 调整'],
    ['comparator()', '自身', 0, '自然序返回 null'],
    ['iterator()', '自身', 1, '坑：遍历顺序不保证有序，要按序出队只能反复 poll'],
    ['size()', '自身', 0, ''],
    ['contains(Object)', '自身', 0, 'O(n)'],
    ['clear()', '自身', 0, ''],
    ['toArray()', '自身', 0, '拿到的是堆数组顺序'],
    ['removeIf(Predicate)', '自身', 0, '删除后会重新堆化'],
    ['PriorityQueue()', '构造', 1, '默认容量 11，自然序'],
    ['PriorityQueue(Comparator)', '构造', 1, '传比较器就能做大顶堆'],
    ['PriorityQueue(int)', '构造', 0, '指定初始容量'],
    ['PriorityQueue(Collection)', '构造', 0, '批量堆化，O(n)'],
    ['PriorityQueue(SortedSet)', '构造', 0, '沿用比较器']
  ],
  grow: 'grow()：容量小于 64 时 newCap = oldCap + 2，否则 newCap = oldCap + (oldCap >> 1)，也就是小的时候近似翻倍，大了以后 1.5 倍。',
  traps: [
    '不允许 null，offer(null) 直接 NullPointerException（因为它要用 null 判断空位）',
    'iterator 不排序！很多人用 for-each 打印出来发现是乱序，以为坏了',
    '元素一旦入堆，改它的排序字段不会重新调整，要改就得先 poll 出来改完再 offer',
    '大顶堆写法：(a, b) -> b - a 有整数溢出风险，用 Comparator.reverseOrder() 或 Integer.compare(b, a)'
  ],
  interview: [
    'PriorityQueue 的底层结构，为什么是数组而不是链表（完全二叉树可以下标定位父子，省指针）',
    '建堆的时间复杂度为什么是 O(n) 而不是 O(n log n)',
    '求 Top K 用大顶堆还是小顶堆（求最大 K 个用小顶堆）',
    'PriorityQueue 和 TreeSet 的区别'
  ],
  doc: '数据结构与算法/一刷代码随想录/12_优先队列和堆.docx'
};

DB.ArrayDeque = {
  kind: 'class',
  sub: '循环数组实现的双端队列',
  tags: [['底层', '循环数组'], ['速度', '栈/队列里最快'], ['null', '不允许']],
  real: { ext: 'AbstractCollection', impl: ['Deque', 'Cloneable', 'Serializable'] },
  intro: 'ArrayDeque 用一段环形数组加 head/tail 两个下标，两端进出都是 O(1)，没有任何节点对象，所以是「当栈用」和「当队列用」的首选。容量一定是 2 的幂，满了直接翻倍。代价是不能存 null——因为 poll 返回 null 表示队列空。',
  fields: [
    ['Object[] elements', 'transient', '环形数组，容量是 2 的幂'],
    ['int head', 'transient', '头部下标'],
    ['int tail', 'transient', '尾部下标（指向下一个空位）'],
    ['int MIN_INITIAL_CAPACITY = 8', 'private static final', '最小容量 8']
  ],
  methods: [
    ['addFirst(E)', '自身', 1, 'head 前移一格放，O(1)'],
    ['addLast(E)', '自身', 1, 'tail 处放，O(1)'],
    ['offerFirst(E)', '自身', 0, ''],
    ['offerLast(E)', '自身', 0, ''],
    ['pollFirst()', '自身', 1, '删头，空返回 null'],
    ['pollLast()', '自身', 1, '删尾，空返回 null'],
    ['peekFirst()', '自身', 1, ''],
    ['peekLast()', '自身', 0, ''],
    ['removeFirst()', '自身', 0, '空抛 NoSuchElementException'],
    ['removeLast()', '自身', 0, ''],
    ['push(E)', '自身', 1, '= addFirst，当栈用'],
    ['pop()', '自身', 1, '= removeFirst，当栈用'],
    ['add(E)', '自身', 0, '= addLast'],
    ['offer(E)', '自身', 0, '= offerLast'],
    ['poll()', '自身', 0, '= pollFirst'],
    ['peek()', '自身', 0, '= peekFirst'],
    ['element()', '自身', 0, '= getFirst，空抛异常'],
    ['getFirst()', '自身', 0, ''],
    ['getLast()', '自身', 0, ''],
    ['removeFirstOccurrence(Object)', '自身', 0, ''],
    ['removeLastOccurrence(Object)', '自身', 0, ''],
    ['descendingIterator()', '自身', 0, ''],
    ['size()', '自身', 0, '用 head/tail 计算，不存 size 字段'],
    ['isEmpty()', '自身', 0, 'head == tail'],
    ['contains(Object)', '自身', 0, 'O(n)'],
    ['clear()', '自身', 0, ''],
    ['ArrayDeque()', '构造', 1, '默认容量 16'],
    ['ArrayDeque(int)', '构造', 0, '传入容量会被向上取到 2 的幂'],
    ['ArrayDeque(Collection)', '构造', 0, '']
  ],
  grow: '满了就翻倍（capacity << 1），并把环形数组重新铺平复制。2 的幂是为了让取模变成 & (length-1)。',
  traps: [
    '不允许 null，addFirst(null) 抛 NullPointerException',
    '当栈用时，iterator 从栈底往栈顶走，想让栈顶先出要用 pop 而不是遍历',
    '泛型不能是基本类型，Deque<Integer> 才算栈，别写成 Deque<int>',
    '当队列跑分：ArrayDeque > LinkedList；当栈跑分：ArrayDeque > Stack，两个场景都赢'
  ],
  interview: [
    'ArrayDeque 为什么比 Stack 和 LinkedList 快（连续内存 + 无节点对象 + 无锁）',
    '为什么容量必须是 2 的幂',
    '环形数组的下标怎么算（(head - 1) & (length - 1) 实现循环回绕）'
  ],
  doc: '数据结构与算法/一刷代码随想录/10_Deque.docx'
};

DB.HashMap = {
  kind: 'class',
  sub: '数组 + 链表 + 红黑树',
  tags: [['线程', '不安全'], ['查找', 'O(1) 均摊'], ['容量', '2 的幂']],
  real: { ext: 'AbstractMap', impl: ['Map', 'Cloneable', 'Serializable'] },
  intro: 'HashMap 是三段式结构：一个 Node 数组（桶），hash 冲突了就挂链表，链表长到 8 且容量到 64 就转红黑树。查找时先用 hash 定位桶，再比 key。默认容量 16、负载因子 0.75，装到 12 个元素就翻倍 rehash。',
  fields: [
    ['Node<K,V>[] table', 'transient', '桶数组，长度是 2 的幂；第一次 put 才初始化'],
    ['int size', 'transient', '键值对个数'],
    ['int threshold', 'int', '扩容阈值 = 容量 × loadFactor，下次扩容的触发点'],
    ['float loadFactor', 'final', '负载因子，默认 0.75，构造时定死不能改'],
    ['int modCount', 'transient', '结构修改次数，fail-fast 用'],
    ['int DEFAULT_INITIAL_CAPACITY = 1 << 4', 'static final', '默认 16，必须是 2 的幂'],
    ['int MAXIMUM_CAPACITY = 1 << 30', 'static final', '上限十亿多，再大就锁死'],
    ['int TREEIFY_THRESHOLD = 8', 'static final', '链表长度到 8 尝试树化'],
    ['int UNTREEIFY_THRESHOLD = 6', 'static final', '树节点少到 6 退化回链表，避免反复转换'],
    ['int MIN_TREEIFY_CAPACITY = 64', 'static final', '容量不到 64 时先扩容而不是树化']
  ],
  methods: [
    ['put(K, V)', '自身', 1, '返回旧值；桶空直接放，冲突走链表/树；size 超阈值先扩容'],
    ['get(Object)', '自身', 1, 'hash 定位桶，桶里比 hash 再比 equals'],
    ['remove(Object)', '自身', 1, '删节点，红黑树节点少到 6 会退化回链表'],
    ['containsKey(Object)', '自身', 1, '只判断存在，不返回值'],
    ['containsValue(Object)', '自身', 1, 'O(n) 全表遍历，别在循环里用'],
    ['putAll(Map)', '自身', 0, ''],
    ['putIfAbsent(K, V)', '自身', 1, 'key 不存在（或值为 null）才放'],
    ['getOrDefault(Object, V)', '自身', 1, '找不到返回默认值，计数常用'],
    ['computeIfAbsent(K, Function)', '自身', 1, 'key 不存在才算并放入，做「一键多值」分组'],
    ['computeIfPresent(K, BiFunction)', '自身', 0, ''],
    ['compute(K, BiFunction)', '自身', 0, ''],
    ['merge(K, V, BiFunction)', '自身', 1, 'map.merge(k, 1, Integer::sum) 是最干净的计数写法'],
    ['replace(K, V)', '自身', 0, ''],
    ['replace(K, V, V)', '自身', 0, ''],
    ['keySet()', '自身', 1, '键的视图，改它会改 Map'],
    ['values()', '自身', 1, '值的视图'],
    ['entrySet()', '自身', 1, '遍历首选，一次拿到 key 和 value'],
    ['forEach(BiConsumer)', '自身', 0, 'JDK8'],
    ['replaceAll(BiFunction)', '自身', 0, ''],
    ['size()', '自身', 1, ''],
    ['isEmpty()', '自身', 0, ''],
    ['clear()', '自身', 0, '遍历所有桶置 null'],
    ['clone()', '自身', 0, '浅拷贝，新表但 key/value 共享'],
    ['HashMap()', '构造', 1, '全部用默认值，第一次 put 才分配数组'],
    ['HashMap(int)', '构造', 1, '传期望容量，内部用 tableSizeFor 向上取到 2 的幂'],
    ['HashMap(int, float)', '构造', 0, '容量 + 负载因子'],
    ['HashMap(Map)', '构造', 0, '']
  ],
  grow: '扩容条件：size > threshold（默认 12）。新容量 = 旧容量 × 2，然后每个节点按 hash 的第 n 位分成「原位置」和「原位置 + 旧容量」两条链，所以 JDK8 的 rehash 不需要重新算 hash。容量是 2 的幂，是为了把取模换成 hash & (length - 1)。',
  traps: [
    'key 必须成对重写 hashCode 和 equals，否则两个「相等」对象能同时存在',
    '并发 put 在 JDK8 会丢数据；JDK7 的头插法还可能导致链表成环、CPU 打满。要并发就用 ConcurrentHashMap',
    'get 返回 null 分不清「没有这个 key」和「值是 null」，要区分必须 containsKey',
    'new HashMap<>(1000) 不会给你 1000 的容量，tableSizeFor 会给你 1024',
    'key 用可变对象，改了参与 hash 的字段就再也 get 不到了',
    '自定义对象做 key，如果不重写 hashCode 就是按地址散列，equals 重写了也没用'
  ],
  interview: [
    'Java 7 和 Java 8 的 HashMap 有哪些区别（头插改尾插、引入红黑树）',
    '为什么容量必须是 2 的幂',
    '为什么负载因子是 0.75（空间和冲突概率的折中，泊松分布算出来的）',
    '为什么链表长度到 8 才转红黑树（正常情况下到 8 的概率极低，是兜底）',
    'hash 方法为什么是 h ^ (h >>> 16)（让高位也参与运算，减少低位相同的冲突）',
    'HashMap 线程不安全的具体表现'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/05_Map集合/13_hashMap源码学习.docx'
};

DB.LinkedHashMap = {
  kind: 'class',
  sub: '能记住顺序的 HashMap',
  tags: [['底层', 'HashMap + 双向链表'], ['顺序', '插入序 / 访问序'], ['用途', 'LRU 缓存']],
  real: { ext: 'HashMap', impl: ['Map', 'Cloneable', 'Serializable'] },
  intro: 'LinkedHashMap 继承 HashMap，把每个节点换成带 before/after 的 Entry，用一条双向链表把所有节点串起来。accessOrder 决定这条链表按「插入顺序」还是「访问顺序」维护——后者加一个 removeEldestEntry 重写，就是一个现成的 LRU。',
  fields: [
    ['Entry<K,V> head', 'transient', '双向链表头（最早的那个）'],
    ['Entry<K,V> tail', 'transient', '双向链表尾（最近的那个）'],
    ['boolean accessOrder', 'final', 'false=插入序，true=访问序，构造时定死'],
    ['Entry 内部的 before / after', 'static class', '串起所有节点的链表指针']
  ],
  methods: [
    ['get(Object)', '自身', 1, 'accessOrder=true 时会把访问到的节点挪到链表尾'],
    ['getOrDefault(Object, V)', '自身', 0, '注意它也会触发访问顺序调整'],
    ['containsValue(Object)', '自身', 0, '走链表遍历，比 HashMap 快一点'],
    ['keySet()', '自身', 0, '按链表顺序'],
    ['values()', '自身', 0, '按链表顺序'],
    ['entrySet()', '自身', 0, '按链表顺序遍历，这才是它比 HashMap 好用的地方'],
    ['forEach(BiConsumer)', '自身', 0, '按链表顺序'],
    ['replaceAll(BiFunction)', '自身', 0, ''],
    ['clear()', '自身', 0, ''],
    ['LinkedHashMap()', '构造', 1, '默认插入序'],
    ['LinkedHashMap(int, float, boolean)', '构造', 1, '第三个参数 true = 访问序，LRU 的关键'],
    ['LinkedHashMap(Map)', '构造', 0, ''],
    ['put(K, V)', 'HashMap', 1, '父类 put，插入后父类回调 afterNodeInsertion 挂到链表'],
    ['remove(Object)', 'HashMap', 0, '回调 afterNodeRemoval 摘链']
  ],
  grow: '继承 HashMap 的扩容规则，另加一条：accessOrder=true 时 get/put 都算结构修改。',
  traps: [
    '想按插入顺序遍历 Map，它就是标准答案，比 TreeMap 快、比 HashMap 稳',
    'accessOrder=true 时 get 也会改 modCount，多线程下更容易抛 ConcurrentModificationException',
    '做 LRU 缓存要重写 removeEldestEntry，返回 true 才会删最老的；光开 accessOrder 不会自动淘汰',
    '它不是线程安全的，做缓存要自己加锁或换 Caffeine'
  ],
  interview: [
    'LinkedHashMap 怎么保证顺序（继承 HashMap + 额外双向链表 + 三个钩子方法）',
    '用 LinkedHashMap 手写一个 LRU（经典手撕题，必须会）',
    'LRU 为什么用 LinkedHashMap 而不是每次排序'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/05_Map集合/13_hashMap源码学习.docx'
};

DB.Hashtable = {
  kind: 'class',
  sub: '同步的老式哈希表',
  tags: [['线程', '方法级 synchronized'], ['null', '都不允许'], ['状态', '已淘汰']],
  real: { ext: 'Dictionary', impl: ['Map', 'Cloneable', 'Serializable'] },
  intro: 'Hashtable 和 HashMap 结构类似，但它是 JDK 1.0 的类、所有方法都加了 synchronized、key 和 value 都不许为 null、默认容量 11 且扩容是 2n+1。因为整张表一把锁，性能远不如 ConcurrentHashMap，现在只在老代码里见到。',
  fields: [
    ['Entry<?,?>[] table', 'transient', '桶数组，长度不要求是 2 的幂'],
    ['int count', 'transient', '键值对个数'],
    ['int threshold', 'int', '扩容阈值'],
    ['float loadFactor', 'float', '默认 0.75'],
    ['int modCount', 'transient', 'fail-fast']
  ],
  methods: [
    ['put(K, V)', '自身', 1, 'synchronized；key/value 为 null 直接 NPE'],
    ['get(Object)', '自身', 1, 'synchronized'],
    ['contains(Object)', '自身', 1, '坑：它判断的是「是否包含这个 value」，不是 key'],
    ['containsKey(Object)', '自身', 1, '判断 key'],
    ['containsValue(Object)', '自身', 1, '判断 value'],
    ['keys()', '自身', 0, '返回 Enumeration，老接口'],
    ['elements()', '自身', 0, '返回 value 的 Enumeration'],
    ['size()', '自身', 0, ''],
    ['remove(Object)', '自身', 0, ''],
    ['clear()', '自身', 0, ''],
    ['toString()', '自身', 0, ''],
    ['computeIfAbsent(K, Function)', '自身', 0, 'JDK8 补的方法，同样带锁'],
    ['merge(K, V, BiFunction)', '自身', 0, ''],
    ['Hashtable()', '构造', 1, '默认容量 11'],
    ['Hashtable(int, float)', '构造', 0, ''],
    ['Hashtable(Map)', '构造', 0, '']
  ],
  grow: '扩容：newCapacity = oldCapacity * 2 + 1（因为初始 11 不是 2 的幂，也就没法用位运算取模）。',
  traps: [
    '不允许 null key 和 null value，这一点和 HashMap 相反，迁移代码时最容易炸',
    'contains(Object) 判断的是 value 不是 key，名字极具误导性',
    '全表一把锁，并发度 = 1，高并发下不如 ConcurrentHashMap',
    '迭代器同样会 fail-fast'
  ],
  interview: ['Hashtable 和 HashMap 的区别（null、同步、初始容量 11、扩容 2n+1、父类是 Dictionary）'],
  doc: 'JavaSE进阶/第七章 集合/集合_01/05_Map集合/05_HashTable/05_01_HashMap和Hashtable区别.docx'
};

DB.TreeMap = {
  kind: 'class',
  sub: '红黑树实现的排序 Map',
  tags: [['底层', '红黑树'], ['顺序', '按 key 排序'], ['复杂度', 'O(log n)']],
  real: { ext: 'AbstractMap', impl: ['NavigableMap', 'Cloneable', 'Serializable'] },
  intro: 'TreeMap 的 key 按大小排好序，底层红黑树，所有操作 O(log n)。它的价值不在「查得快」，而在「有序」：能拿首尾、能取区间、能找最接近的键。做排行榜、时间区间统计、字典序场景用它。',
  fields: [
    ['Entry<K,V> root', 'private transient', '红黑树根节点'],
    ['Comparator<? super K> comparator', 'private final', '为 null 时用 key 的自然顺序'],
    ['int size', 'private transient', '键值对个数'],
    ['int modCount', 'private transient', 'fail-fast']
  ],
  methods: [
    ['put(K, V)', '自身', 1, '红黑树插入 + 平衡，O(log n)'],
    ['get(Object)', '自身', 1, 'O(log n)，比 HashMap 慢但有序'],
    ['firstKey()', '自身', 1, '最小 key'],
    ['lastKey()', '自身', 1, '最大 key'],
    ['firstEntry()', '自身', 1, '最小键值对'],
    ['lastEntry()', '自身', 0, ''],
    ['pollFirstEntry()', '自身', 1, '取出并删除最小键值对'],
    ['pollLastEntry()', '自身', 0, ''],
    ['ceilingKey(K)', '自身', 1, '大于等于 k 的最小 key，没有返回 null'],
    ['floorKey(K)', '自身', 1, '小于等于 k 的最大 key'],
    ['higherKey(K)', '自身', 1, '严格大于 k'],
    ['lowerKey(K)', '自身', 1, '严格小于 k'],
    ['ceilingEntry(K)', '自身', 0, '同上，返回 Entry'],
    ['floorEntry(K)', '自身', 0, ''],
    ['higherEntry(K)', '自身', 0, ''],
    ['lowerEntry(K)', '自身', 0, ''],
    ['headMap(K)', '自身', 1, '小于 toKey 的视图'],
    ['tailMap(K)', '自身', 1, '大于等于 fromKey 的视图'],
    ['subMap(K, K)', '自身', 1, '区间视图，左闭右开'],
    ['headMap(K, boolean)', '自身', 0, '能控端点开闭'],
    ['tailMap(K, boolean)', '自身', 0, ''],
    ['subMap(K, boolean, K, boolean)', '自身', 0, ''],
    ['descendingMap()', '自身', 1, '倒序视图'],
    ['descendingKeySet()', '自身', 0, ''],
    ['navigableKeySet()', '自身', 0, ''],
    ['comparator()', '自身', 0, '自然序返回 null'],
    ['computeIfAbsent(K, Function)', '自身', 0, '注意它在 key 不存在时可能抛 NPE，是 TreeMap 的老毛病'],
    ['merge(K, V, BiFunction)', '自身', 0, ''],
    ['size()', '自身', 0, ''],
    ['keySet()', '自身', 0, '按 key 升序'],
    ['entrySet()', '自身', 0, '按 key 升序'],
    ['values()', '自身', 0, '按 key 升序'],
    ['TreeMap()', '构造', 1, '自然序，key 必须实现 Comparable'],
    ['TreeMap(Comparator)', '构造', 1, '自定义排序'],
    ['TreeMap(Map)', '构造', 0, ''],
    ['TreeMap(SortedMap)', '构造', 0, '沿用比较器']
  ],
  grow: '红黑树不扩容，只有旋转和变色。',
  traps: [
    'key 不能是 null（自然序下），要么给 Comparator 让它能处理 null',
    'compare 返回 0 就被当成同一个 key，后 put 的 value 会覆盖前面的',
    '不加比较器时，key 必须实现 Comparable，否则 ClassCastException',
    '非线程安全，并发有序场景用 ConcurrentSkipListMap'
  ],
  interview: [
    'TreeMap 和 HashMap 的区别',
    '红黑树的五条性质和插入调整',
    '怎么用 TreeMap 做「找小于等于某值的最接近键」'
  ],
  doc: 'JavaSE进阶/第七章 集合/集合_01/05_Map集合/10_自平衡二叉树.docx'
};

DB.Iterable = {
  kind: 'extra',
  sub: '能 foreach 的根接口',
  tags: [['位置', 'Collection 的父接口'], ['能力', 'foreach / stream'], ['方法', '3 个']],
  real: { ext: 'java.lang 包', impl: [] },
  intro: 'foreach 不是语法糖凭空变出来的：编译器看到 foreach 就把 for (T x : c) 改写成 c.iterator() 的 while 循环。所以只要实现 Iterable，你的类就能被 foreach 遍历。Collection 之所以能 foreach，是因为它继承了 Iterable。',
  fields: [['无实例字段', '接口', '']],
  methods: [
    ['iterator()', '自身', 1, '返回迭代器，foreach 编译后调的就是它'],
    ['forEach(Consumer)', '自身', 1, 'JDK8 默认方法，Collection 的 forEach 来自这里'],
    ['spliterator()', '自身', 0, 'JDK8 并行流用的分割迭代器']
  ],
  grow: '接口不涉及。',
  traps: [
    '数组能用 foreach 是因为编译器直接生成下标循环，不需要 Iterable',
    '自己写集合类只实现 Iterable 就能 foreach，不必继承 Collection'
  ],
  interview: ['foreach 的底层实现', '为什么 foreach 里不能直接 remove（因为拿不到迭代器引用）'],
  doc: 'JavaSE进阶/第七章 集合/集合_01/02_Collection集合/02_02_迭代专题.docx'
};

DB.Iterator = {
  kind: 'extra',
  sub: '遍历器，也是 fail-fast 的守卫',
  tags: [['方法', '4 个'], ['机制', 'fail-fast'], ['安全删除', 'remove()']],
  real: { ext: '无', impl: [] },
  intro: 'Iterator 是遍历集合的标准姿势。它内部记着 modCount，每次 next 都和集合的 modCount 比一次，不一样就抛 ConcurrentModificationException——这就是 fail-fast。想边遍历边删，只能用迭代器自己的 remove，不能用集合的 remove。',
  fields: [['cursor', '实现类内部', '下一个要返回的下标'], ['lastRet', '实现类内部', '上一个返回的下标，remove 用'], ['expectedModCount', '实现类内部', '创建时的修改次数，用于 fail-fast']],
  methods: [
    ['hasNext()', '自身', 1, '还有没有下一个'],
    ['next()', '自身', 1, '返回下一个，没有抛 NoSuchElementException'],
    ['remove()', '自身', 1, '删除 lastRet 位置的元素，遍历中安全删除的唯一正路'],
    ['forEachRemaining(Consumer)', '自身', 0, 'JDK8，把剩下的全消费掉']
  ],
  grow: '不涉及。',
  traps: [
    'foreach 里调集合的 remove 必抛 CME，因为 foreach 用的是你看不见的迭代器',
    'next() 之前调 remove() 抛 IllegalStateException；连续两次 remove 也抛',
    'fail-fast 只是「尽力检测」，不保证一定能发现并发修改，不能当同步手段用'
  ],
  interview: ['fail-fast 和 fail-safe 的区别（CopyOnWriteArrayList 的迭代器就是 fail-safe）', '怎么在遍历中安全删除元素'],
  doc: 'JavaSE进阶/第七章 集合/集合_01/02_Collection集合/02_05_迭代器注意点.docx'
};

DB.Collections = {
  kind: 'extra',
  sub: '集合工具类，全是静态方法',
  tags: [['性质', '工具类'], ['方法', '66 个'], ['注意', '不是 Collection']],
  real: { ext: 'java.util', impl: [] },
  intro: 'Collections 是操作集合的静态工具类，名字比 Collection 多个 s。最常用三类：排序类（sort/reverse/shuffle）、包装类（unmodifiableXxx/synchronizedXxx）、空集合常量（emptyList/EMPTY_LIST）。包装返回的都是原集合的视图，不是副本。',
  fields: [['EMPTY_LIST / EMPTY_SET / EMPTY_MAP', 'static final', '共享的空集合常量，不可变']],
  methods: [
    ['sort(List)', '自身', 1, '原地排序，稳定，要求元素可比较'],
    ['sort(List, Comparator)', '自身', 1, '自定义排序'],
    ['reverse(List)', '自身', 1, '原地反转'],
    ['shuffle(List)', '自身', 1, '随机打乱，洗牌常用'],
    ['swap(List, int, int)', '自身', 0, '交换两个位置'],
    ['max(Collection)', '自身', 1, '最大值'],
    ['min(Collection)', '自身', 1, '最小值'],
    ['frequency(Collection, Object)', '自身', 0, '统计出现次数'],
    ['unmodifiableList(List)', '自身', 1, '返回只读视图，写操作抛 UnsupportedOperationException'],
    ['unmodifiableMap(Map)', '自身', 0, ''],
    ['synchronizedList(List)', '自身', 1, '包一层锁，但迭代时仍要手动 synchronized'],
    ['synchronizedMap(Map)', '自身', 0, ''],
    ['emptyList()', '自身', 1, '返回共享的不可变空 List'],
    ['singletonList(Object)', '自身', 1, '只有一个元素的不可变 List'],
    ['nCopies(int, Object)', '自身', 0, 'n 个相同元素的不可变 List'],
    ['addAll(Collection, T...)', '自身', 1, '批量加，比反复 add 省事'],
    ['binarySearch(List, Object)', '自身', 0, '二分查找，前提是已排好序']
  ],
  grow: '工具类，不涉及。',
  traps: [
    'unmodifiableList 是视图：原 List 变了它跟着变，不是快照',
    'synchronizedList 只保证单方法安全，遍历时还要自己 synchronized (list)',
    'Collections.sort 只能排 List，不能排 Set；Set 要排序得自己转 TreeSet',
    'emptyList() 是共享常量，往里 add 会抛异常'
  ],
  interview: ['Collection 和 Collections 的区别', 'unmodifiable 和 immutable 的区别（视图 vs 副本）'],
  doc: 'JavaSE进阶/第七章 集合/集合_01/06_Collections工具类'
};

DB.ConcurrentHashMap = {
  kind: 'extra',
  sub: '高并发哈希表',
  tags: [['线程', '安全'], ['锁粒度', '单个桶'], ['null', '不允许']],
  real: { ext: 'AbstractMap', impl: ['ConcurrentMap', 'Serializable'] },
  intro: 'JDK8 的 ConcurrentHashMap 把锁粒度降到单个桶：桶空时用 CAS 直接放，桶不空时 synchronized 锁住桶头节点。get 全程无锁（Node 的 val 是 volatile）。所以并发度接近桶的数量，而不是 Hashtable 的 1。',
  fields: [
    ['Node<K,V>[] table', 'transient volatile', '桶数组，volatile 保证可见性'],
    ['int sizeCtl', 'transient volatile', '负数表示正在初始化/扩容，正数是扩容阈值'],
    ['int MOVED = -1', 'static final', '转发节点的 hash 值，标记这个桶正在迁移'],
    ['int RESIZE_STAMP_SHIFT 等', 'static final', '扩容时用的位运算常量']
  ],
  methods: [
    ['put(K, V)', '自身', 1, 'key/value 为 null 直接 NPE；桶空 CAS，桶非空锁桶头'],
    ['get(Object)', '自身', 1, '无锁读，只依赖 volatile 的 val'],
    ['remove(Object)', '自身', 1, ''],
    ['putIfAbsent(K, V)', '自身', 1, '原子操作，比 containsKey 再 put 安全'],
    ['computeIfAbsent(K, Function)', '自身', 1, '原子计算，做本地缓存首选'],
    ['compute(K, BiFunction)', '自身', 0, '整个计算过程对同一个 key 是原子的'],
    ['merge(K, V, BiFunction)', '自身', 1, '原子计数'],
    ['size()', '自身', 1, '是估算值（累加 CounterCell），高并发下不精确'],
    ['mappingCount()', '自身', 0, '返回 long，比 size 更推荐的写法'],
    ['keySet()', '自身', 0, '弱一致视图'],
    ['newKeySet()', '自身', 0, 'JDK8 静态方法，直接造一个线程安全的 Set']
  ],
  grow: '扩容是并发迁移：多个线程可以一起帮忙搬桶，靠 ForwardingNode 标记哪些桶搬完了。',
  traps: [
    '不允许 null key 和 null value——因为并发下无法区分「没有」和「值是 null」',
    'size() 不精确，只是估算；需要精确计数用 LongAdder',
    '复合操作要靠它提供的原子方法，containsKey + put 仍然是竞态',
    '它的迭代器是弱一致的：遍历时能看到部分修改，不会抛 CME'
  ],
  interview: [
    'ConcurrentHashMap 在 JDK7 和 JDK8 的差别（分段锁 → CAS + synchronized 桶锁）',
    '为什么 get 不需要加锁',
    'size 怎么算的，为什么不精确',
    '为什么不允许 null'
  ],
  doc: '并发编程/第七章 并发工具/线程安全的集合类/04_ConcurrentHashMap源码分析.docx'
};

DB.CopyOnWriteArrayList = {
  kind: 'extra',
  sub: '写时复制的线程安全 List',
  tags: [['线程', '安全'], ['读', '无锁'], ['写', '复制整个数组']],
  real: { ext: 'Object', impl: ['List', 'RandomAccess', 'Cloneable', 'Serializable'] },
  intro: 'CopyOnWriteArrayList 的思路很直接：读的时候不加锁、不阻塞；写的时候先加锁，复制一份新数组，改完再把引用指过去。所以读极快、写极贵，适合「读多写极少」的场景，比如事件监听器列表、黑白名单。',
  fields: [
    ['Object[] array', 'private transient volatile', '当前的数组，写操作会整体替换它'],
    ['ReentrantLock lock', 'final transient', '写操作互斥用，读不碰它']
  ],
  methods: [
    ['get(int)', '自身', 1, '直接读数组，完全无锁，O(1)'],
    ['add(E)', '自身', 1, '加锁 + Arrays.copyOf + 置新元素，O(n)'],
    ['addIfAbsent(E)', '自身', 1, '不存在才加，内部遍历一遍，O(n)'],
    ['remove(Object)', '自身', 1, '复制一份去掉该元素，O(n)'],
    ['set(int, E)', '自身', 0, '复制整个数组再改一个位置'],
    ['iterator()', '自身', 1, '返回快照，遍历期间的修改看不见，也不会抛 CME'],
    ['size()', '自身', 0, ''],
    ['toArray()', '自身', 0, '']
  ],
  grow: '没有扩容概念，每次写都新建一个 length 刚好的数组。',
  traps: [
    '迭代器是快照：拿到之后原列表再怎么改，你都看不到',
    '迭代器的 remove 直接抛 UnsupportedOperationException',
    '写性能极差，循环里 add 一万次就是复制一万次数组',
    '数据量大时内存会短时间翻倍'
  ],
  interview: ['写时复制的原理和适用场景', '它和 Collections.synchronizedList 的区别'],
  doc: '并发编程/第七章 并发工具/线程安全的集合类/08_CopyOnWriteArrayList.docx'
};

DB.LinkedBlockingQueue = {
  kind: 'extra',
  sub: '阻塞队列，线程池的排队区',
  tags: [['线程', '安全'], ['容量', '可选有界'], ['用途', '生产者消费者']],
  real: { ext: 'AbstractQueue', impl: ['BlockingQueue', 'Serializable'] },
  intro: 'LinkedBlockingQueue 是链表实现的可选有界阻塞队列，内部两把锁：putLock 管入队、takeLock 管出队，所以生产和消费能真正并行。ThreadPoolExecutor 的默认队列就是它（Executors.newFixedThreadPool 用的无界版本，这也是它容易 OOM 的根源）。',
  fields: [
    ['Node<E> head / last', 'transient', '链表头尾，head 是个哑节点'],
    ['AtomicInteger count', 'final', '元素计数，用 CAS 维护'],
    ['ReentrantLock putLock / takeLock', 'final', '入队锁和出队锁，分开是为了不互相阻塞'],
    ['int capacity', 'final', '容量，默认 Integer.MAX_VALUE'],
    ['Condition notEmpty / notFull', 'final', '两个条件队列，实现阻塞等待']
  ],
  methods: [
    ['put(E)', '自身', 1, '队列满了就阻塞，直到有空位'],
    ['take()', '自身', 1, '队列空了就阻塞，直到有元素'],
    ['offer(E)', '自身', 1, '不阻塞，满了返回 false'],
    ['offer(E, long, TimeUnit)', '自身', 1, '最多等指定时间'],
    ['poll(long, TimeUnit)', '自身', 1, '最多等指定时间拿元素'],
    ['peek()', '自身', 0, '看队头'],
    ['size()', '自身', 0, '返回 count，近似值'],
    ['remainingCapacity()', '自身', 0, '还能放几个'],
    ['drainTo(Collection)', '自身', 1, '一次把队列搬空，批量处理常用'],
    ['LinkedBlockingQueue(int)', '构造', 1, '指定容量，生产环境务必指定'],
    ['LinkedBlockingQueue()', '构造', 1, '容量 Integer.MAX_VALUE，等于无界，慎用']
  ],
  grow: '容量固定，满了阻塞或拒绝，不会扩容。',
  traps: [
    '无参构造等价于无界队列，任务堆积会一路涨到 OOM',
    '两把锁带来一个问题：size() 不是精确的强一致读数',
    'put/take 会阻塞，用错线程（比如在 IO 线程里 take）会把整个链路卡死'
  ],
  interview: [
    'ArrayBlockingQueue 和 LinkedBlockingQueue 的区别（一把锁 vs 两把锁，数组 vs 链表）',
    '线程池为什么建议用有界队列',
    '阻塞队列怎么实现生产者消费者'
  ],
  doc: '并发编程/第七章 并发工具/线程安全的集合类/06_LinkedBlockingQueue.docx'
};


/* 示例代码层：单独放，方便以后只改代码不动讲解
   格式 DEMOS[类名] = [ ['小节标题', `代码`], ... ]
   代码以 JDK 17 语法为准，但都只用 Java 8 就能编译的写法 */

const DEMOS = {
  List: [
    ['Arrays.asList 的三个坑', `int[] arr = {1, 2, 3};
List list = Arrays.asList(arr);
// 装进去的是「整个 int[]」，不是三个元素
System.out.println(list.size());            // 1，不是 3
System.out.println(list.get(0).getClass()); // class [I

List<String> fixed = Arrays.asList("a", "b", "c");
fixed.set(0, "A");   // 可以，底层就是那个数组
fixed.add("d");      // UnsupportedOperationException
fixed.remove(0);     // UnsupportedOperationException

// 要可变，包一层
List<String> ok = new ArrayList<>(Arrays.asList("a", "b", "c"));
ok.add("d");         // 正常

// List.of 更狠：连 set 都不行，元素不能是 null
List<String> ro = List.of("a", "b");
ro.set(0, "A");      // UnsupportedOperationException`]
  ],

  ArrayList: [
    ['初始化、插入、遍历中删除', `// 能预估数量就直接给容量，省掉反复扩容复制
List<String> list = new ArrayList<>(1000);
list.add("a");
list.add(0, "b");                   // 插中间，后面整体右移 O(n)
System.out.println(list);           // [b, a]

List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));

// 错：删一个就错位，还可能抛 ConcurrentModificationException
for (Integer n : nums) {
    if (n % 2 == 0) nums.remove(n);
}

// 对：迭代器自己的 remove
Iterator<Integer> it = nums.iterator();
while (it.hasNext()) {
    if (it.next() % 2 == 0) it.remove();
}

// 更好：JDK8 的 removeIf，一行
nums.removeIf(n -> n % 2 == 0);
System.out.println(nums);           // [1, 3, 5]`]
  ],

  LinkedList: [
    ['当队列、当栈，以及 get(i) 的代价', `// 当队列：尾进头出
Deque<String> q = new LinkedList<>();
q.offerLast("a");
q.offerLast("b");
System.out.println(q.pollFirst());   // a

// 当栈：push/pop 走的是头部
Deque<String> s = new LinkedList<>();
s.push("a");
s.push("b");
System.out.println(s.pop());         // b

// 坑：按下标遍历是 O(n²)，每次 get 都从头或尾走一半
List<Integer> list = new LinkedList<>();
for (int i = 0; i < list.size(); i++) {
    list.get(i);
}
// 改成下面这样才对
for (Integer x : list) {
}`]
  ],

  Queue: [
    ['三对方法：抛异常 vs 返回特殊值', `Queue<Integer> q = new ArrayDeque<>();

q.offer(1);      // 成功 true；有界队列满了返回 false
q.add(2);        // 成功 true；满了抛 IllegalStateException
q.peek();        // 1，空队列返回 null
q.element();     // 1，空队列抛 NoSuchElementException
q.poll();        // 1，空队列返回 null
q.remove();      // 2，空队列抛 NoSuchElementException

// 生产代码里基本只用 offer / poll / peek，不靠异常控流程`]
  ],

  HashSet: [
    ['去重，以及 equals 和 hashCode 必须成对重写', `// 去重一行搞定，比 List.contains 快一个量级
List<String> list = List.of("a", "b", "a", "c", "b");
Set<String> set = new HashSet<>(list);
System.out.println(set.size());      // 3

class User {
    private final String id;
    User(String id) { this.id = id; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        return Objects.equals(id, ((User) o).id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}

Set<User> users = new HashSet<>();
users.add(new User("1001"));
users.add(new User("1001"));
System.out.println(users.size());    // 1

// 只写 equals 不写 hashCode：两个都能进，size 变成 2`]
  ],

  TreeSet: [
    ['自定义排序，和「比较为 0 就算重复」', `// 按字符串长度排
Comparator<String> byLength =
        Comparator.comparingInt(String::length);
Set<String> byLen = new TreeSet<>(byLength);
byLen.add("aaa");
byLen.add("b");
byLen.add("cc");
System.out.println(byLen);           // [b, cc, aaa]

// 坑：长度相同的不同字符串，compare 返回 0，被当成重复丢掉
System.out.println(byLen.add("dd"));       // false
System.out.println(byLen.size());          // 还是 3
System.out.println(byLen.contains("dd"));  // true，没存却找得到

// 要按长度排又不丢元素，比较器最后补一层兜底
Comparator<String> byLenThenName =
        Comparator.comparingInt(String::length)
                .thenComparing(Comparator.naturalOrder());
Set<String> safe = new TreeSet<>(byLenThenName);
safe.addAll(List.of("cc", "dd"));
System.out.println(safe.size());     // 2`]
  ],

  TreeMap: [
    ['排序、区间、找最接近的键', `TreeMap<String, Integer> score = new TreeMap<>();
score.put("b", 80);
score.put("a", 90);
score.put("c", 70);
System.out.println(score);               // {a=90, b=80, c=70}

System.out.println(score.firstKey());    // a
System.out.println(score.headMap("c"));  // {a=90, b=80}，左闭右开
System.out.println(score.tailMap("b"));  // {b=80, c=70}

// 找最接近的键：floor 往下找，ceiling 往上找
System.out.println(score.floorKey("bb"));    // b
System.out.println(score.ceilingKey("bb"));  // c

// 倒序只用改构造器
System.out.println(new TreeMap<>(Comparator.reverseOrder()));
// 坑：comparator 返回 0 就是同一个 key，后 put 的会覆盖`]
  ],

  LinkedHashMap: [
    ['三行写一个 LRU 缓存', `class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int cap;

    LruCache(int cap) {
        super(cap, 0.75f, true);   // true = 按访问顺序
        this.cap = cap;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > cap;       // 超了就把最久没访问的删掉
    }
}

LruCache<String, Integer> cache = new LruCache<>(2);
cache.put("a", 1);
cache.put("b", 2);
cache.get("a");                    // 访问 a，它被挪到链表尾
cache.put("c", 3);                 // 挤掉最久没用的 b
System.out.println(cache.keySet()); // [a, c]`]
  ],

  PriorityQueue: [
    ['小顶堆、大顶堆、Top K', `// 默认小顶堆
Queue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(5);
minHeap.offer(1);
minHeap.offer(3);
System.out.println(minHeap.poll());   // 1

// 大顶堆
Comparator<Integer> desc = Comparator.reverseOrder();
Queue<Integer> maxHeap = new PriorityQueue<>(desc);
maxHeap.offer(5);
maxHeap.offer(1);
System.out.println(maxHeap.poll());   // 5

// 求最大的 3 个数：维护一个大小 3 的小顶堆
int[] nums = {7, 1, 9, 3, 5, 8};
Queue<Integer> top3 = new PriorityQueue<>();
for (int n : nums) {
    top3.offer(n);
    if (top3.size() > 3) top3.poll();  // 把最小的挤出去
}
System.out.println(top3);             // 元素是最大的三个，顺序不保证

// 坑：foreach 遍历顺序不是排序结果，要按序出队只能反复 poll
while (!top3.isEmpty()) {
    System.out.print(top3.poll() + " ");   // 7 8 9
}`]
  ],

  ArrayDeque: [
    ['当栈比 Stack 快，当队列比 LinkedList 快', `// 当栈用
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
System.out.println(stack.pop());     // 2
System.out.println(stack.peek());    // 1

// 当队列用
Deque<Integer> queue = new ArrayDeque<>();
queue.offerLast(1);
queue.offerLast(2);
System.out.println(queue.pollFirst());  // 1

// 坑：不允许 null，因为 poll 返回 null 已经表示「空了」
stack.push(null);   // NullPointerException`]
  ],

  Collections: [
    ['排序、只读视图、同步包装', `List<Integer> list = new ArrayList<>(List.of(3, 1, 2));

Collections.sort(list);            // 升序，稳定排序
Collections.reverse(list);         // 原地反转
System.out.println(Collections.max(list));
Collections.shuffle(list);         // 洗牌

// 只读视图：原集合变了它也变，不是快照
List<Integer> ro = Collections.unmodifiableList(list);
ro.add(4);                         // UnsupportedOperationException

// 同步包装：单方法安全，复合操作和遍历还得自己加锁
List<Integer> sync =
        Collections.synchronizedList(new ArrayList<>());
synchronized (sync) {
    for (Integer x : sync) {
    }
}

// 空集合常量是共享的，往里 add 直接抛异常
List<String> empty = Collections.emptyList();`]
  ],

  Iterator: [
    ['fail-fast：为什么 foreach 里不能 remove', `List<String> list = new ArrayList<>(List.of("a", "b", "c"));

// 错：foreach 编译后用的是隐藏的迭代器，它发现 modCount 变了就抛
for (String s : list) {
    // 下一轮 next() 时在这里抛 ConcurrentModificationException
    if (s.equals("b")) list.remove(s);
}

// 对：用迭代器自己的 remove，它会同步 modCount
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    if (it.next().equals("b")) it.remove();
}

// 或者 JDK8 的 removeIf
list.removeIf(s -> s.equals("b"));`]
  ],

  ConcurrentHashMap: [
    ['原子计数、本地缓存、两个禁止项', `ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// 原子计数：不要 containsKey 再 put，那是两次操作
map.merge("hit", 1, Integer::sum);

// 本地缓存典型写法：没有才算，load 换成你自己的查库逻辑
ConcurrentMap<String, String> cache = new ConcurrentHashMap<>();
String v = cache.computeIfAbsent("k", k -> load(k));

// 坑一：key 和 value 都不允许 null
map.put("k", null);        // NullPointerException

// 坑二：size() 是估算值（baseCount + CounterCell 汇总）
long n = map.mappingCount();   // 需要精确计数就自己用 LongAdder`]
  ],

  CopyOnWriteArrayList: [
    ['读多写少：遍历期间可以放心改', `List<String> listeners = new CopyOnWriteArrayList<>();
listeners.add("a");

// 遍历的是快照，期间 add 不会抛异常，但你也看不到新加的那个
for (String s : listeners) {
    listeners.add("b");
}
System.out.println(listeners.size());   // 2

// 坑：迭代器不支持 remove
Iterator<String> it = listeners.iterator();
it.next();
// 迭代器的 remove 直接抛 UnsupportedOperationException
it.remove();

// 适合监听器、黑白名单这种「读极多、写极少」的场景
// 不适合循环 add 一万次，那是复制一万次数组`]
  ],

  LinkedBlockingQueue: [
    ['生产者消费者，以及务必给容量', `// 容量一定要给，无参构造等于无界
BlockingQueue<String> q = new LinkedBlockingQueue<>(10);

new Thread(() -> {
    try {
        q.put("task-1");                  // 满了就阻塞
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();

new Thread(() -> {
    try {
        System.out.println(q.take());      // 空了就阻塞
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();

// 非阻塞版本：满了 offer 返回 false，空了 poll 返回 null
System.out.println(q.offer("task-2"));
System.out.println(q.poll());

// 无参构造的容量是 Integer.MAX_VALUE，任务堆积会一路涨到 OOM`]
  ]
};


const TARGET = 'site';
