---title: "算法笔记:链表、双指针与区间和"
date: 2026-09-06T06:03:00+08:00
draft: false
weight: 110
description: "算法的通用注意细节、链表的拆节点操作,以及二分查找、移除元素、有序数组平方、长度最小的子数组、螺旋矩阵、区间和等练习题的解法要点。"
tags: ["算法", "链表", "双指针", "二分查找", "螺旋矩阵"]
categories: ["算法与数据结构"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
aliases: ["/posts/algo-basics/"]
---

## 一、通用注意细节

1. 数组起手一定要判断数组为空或者长度为 0 的情况
2. Java 采用的是<span color="red">值传递</span>
3. 在 LeetCode（以及所有算法题）里,<span color="red">子数组（Subarray）必须是原数组中连续的一段</span>——不连续的只能叫子序列

---

## 二、链表

通过每个节点上的 `prev` 和 `next` 指针,将零散的内存块串联起来形成一个链式结构。

1. 提升内存利用效率
2. 用的时候能连上:new 一个新 ListNode 对象出来,改一下前后结点指针;不用的时候可以拆掉

### 2.1 拆掉非尾部节点

- 单链表:即便你已经有了要删除结点的引用,也不能直接找到前驱节点;只能从头遍历找到前驱节点以后再删,时间复杂度 **O(n)**
- 双链表:只要有了要删除的节点的引用,直接:

```java
node.prev.next = node.next;
node.next.prev = node.prev;
```

时间复杂度 **O(1)**

### 2.2 拆掉尾部节点

- 单链表:必须从头遍历找出哪个节点的 `next` 的 `next == null`,然后将这个节点的 `next` 设置为 `null`,时间复杂度 **O(n)**
- 双链表:尾部节点有自己的 `prev` 指针。只要找到哪个节点的 `next == null`,然后将这个节点的 `prev` 的 `next` 设置为 `null` 即可,时间复杂度 **O(1)**

---

## 三、练习

### 3.1 二分查找

要求 `nums[]` 一定是有序数组（升序或者降序）。通过 `nums[left]`、`nums[right]`、`nums[mid]` 来逐步缩减查找范围。

- <span color="red">左闭右闭</span>:
  - `right = nums.length - 1;`
  - 循环条件:`left ≤ right`
- <span color="red">左闭右开</span>:
  - `right = nums.length`

### 3.2 移除元素

题目:给你一个数组 `nums` 和一个值 `val`,你需要<span color="red">原地</span>移除所有数值等于 `val` 的元素,并返回移除后数组的新长度。

要求:

- 不要使用额外的数组空间
- 必须仅使用 **O(1)** 额外空间并原地修改输入数组
- 元素的顺序可以改变
- 不需要考虑数组中超出新长度后面的元素

**快慢指针法:**

- `fastIndex` 用来扫描整个数组,判断指到的东西是否等于 `val`。等于的话直接 `++`;不等于的话执行 `nums[slowIndex] = nums[fastIndex]`
- `slowIndex` 用来改变数组的元素位置
- 一个 while 循环就可以解决

### 3.3 有序数组的平方排序

要求:给你一个有序数组,然后新数组的元素是这个数组的每个元素的平方,并且新数组要是有序的。

1. 先平方再排序:直接用 `Arrays.sort()` 方法,时间复杂度 **O(n log n)**
2. <span color="red">双指针</span>:时间复杂度 **O(n)**

![平方排序的双指针解法](/images/algo/algo-square-sorted.png)

### 3.4 长度最小的子数组（力扣 209）

注意是子数组,一定要是连着的。

暴力解法就已经很难做了,过不去力扣测试,超时。

![长度最小的子数组](/images/algo/algo-min-subarray.png)

暴力解法就是两层 for 循环,从第一个元素开始找。

### 3.5 螺旋矩阵

第一版不太完美的解法,有越界修正,最好使用 for 循环。

```java
class Solution {
    public int[][] generateMatrix(int n) {
        int[][] matrix = new int[n][n];
        matrix[0][0] = 1;
        int k = 1;
        int i = 0;
        int j = 0;
        int i_MIN = 0;
        int j_MIN = 0;
        int i_MAX = n - 1;
        int j_MAX = n - 1;
        // 第一步，i不动，j开始做j++，matrix[i][j] = k;k++;j++;加到j_MAX时，i++，i_MIN++,停止.
        // 第二步，j不动，i开始做i++,matrix[i][j] = k;k++;i++;加到i_MAX时，j--;j_MAX--,停止，
        // 第三步，i不动，j开始做j--,matrix[i][j] = k;k++;j--;减到j_MIN时，i--;i_MAX--;停止
        // 第四步，j不动，i开始做i--,matrix[i][j] = k;k++;i--;减到i_MIN时，j++,j_MIN++;停止
        if (n == 1) {
            return matrix;
        }

        while (i < i_MAX + 1 && j < j_MAX + 1 && i > i_MIN - 1 && j > j_MIN - 1) {

            while (i == i_MIN && j <= j_MAX) {
                matrix[i][j] = k;
                k++;
                j++;
            }
            j--;// 越界修正
            i++;
            i_MIN++;
            while (j == j_MAX && i <= i_MAX) {
                matrix[i][j] = k;
                k++;
                i++;
            }
            i--;// 越界修正
            j--;
            j_MAX--;
            while (i == i_MAX && j >= j_MIN) {
                matrix[i][j] = k;
                k++;
                j--;
            }
            j++;// 越界修正
            i--;
            i_MAX--;
            while (j == j_MIN && i >= i_MIN) {
                matrix[i][j] = k;
                k++;
                i--;
            }
            i++;// 越界修正
            j++;
            j_MIN++;

        }

        return matrix;

    }

}
```

> 说明:原文注释第四步写的是 `matrix[i][j] = j;`,与前后三步的 `= k;` 不一致,属笔误,已改正为 `= k;`。

### 3.6 区间和

暴力但超时:

![区间和的暴力解法](/images/algo/algo-prefix-brute.png)

注意,题目没有说让你求几个区间,所以 `hasNextInt()` 是很好的判断方式。

前缀和解法:（待补充）
