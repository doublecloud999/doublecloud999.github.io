---title: "Java 多线程入门"
date: 2026-09-21T20:05:07+08:00
draft: false
weight: 80
description: "进程与线程的区别、JDK / JRE / JVM 的包含关系、HotSpot 与 JIT，线程的两种创建方式（run 与 start 的栈帧差异）、线程生命周期与锁池，以及 JVM 堆栈方法区的内存划分。"
tags: ["Java", "多线程", "并发", "JVM"]
categories: ["并发多线程"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
aliases: ["/posts/java-thread-intro/"]
---

## 一、进程与线程

### 1.1 进程

- OS 中的独立执行单元，包括正在执行的程序、数据和系统资源
- <span color="red">每个进程有独立内存空间，不同进程之间不可以直接共享数据</span>

### 1.2 线程

- <span color="red">是进程内的执行单元，是操作系统分配 CPU 时间的基本单位</span>
- <span color="red">同一个进程内的线程可以共享相同的内存空间和资源</span>
- <span color="red">**Java 线程与操作系统内核线程是 1:1 映射关系**</span>

### 1.3 两者的区别

- <span color="red">进程</span>是独立的执行单元，有独立内存空间，进程之间通信需要额外机制
- <span color="red">线程</span>是进程内的执行单元，共享进程的内存空间，线程之间可以直接共享数据

注意：

- 进程是 OS 进行<span color="red">资源分配</span>的基本单位，在 JVM 启动的时候，操作系统为它分配独立的内存空间（虚拟地址空间）、文件描述符等等资源
- 线程是 OS 进行 <span color="red">CPU 调度</span>的基本单位，线程存在于进程内部，共享进程的内存地址空间

### 1.4 JDK > JRE > JVM

JDK（Java 开发工具包）⊃ JRE（Java 运行环境）⊃ JVM（Java 虚拟机）。

### 1.5 HotSpot JVM

HotSpot JVM 是目前 Java 生态中最主流、使用最广泛的 Java 虚拟机（JVM）的具体软件实现。

- 即时编译器（JIT，Just-In-Time Compiler）。在运行过程中，它会持续监控代码的执行频率。如果某段代码（例如循环体或频繁调用的方法）被执行得非常频繁，它就会被标记为“<span color="red">热点代码</span>（Hot Spot Code）”。
- 一旦被标记为热点，JVM 就会将这段字节码直接编译成当前操作系统底层的<span color="red">机器码</span>，并进行深度优化。这样后续执行这段代码时，就不需要再通过解释器，从而极大提高了运行速度。

---

## 二、线程创建方式

创建线程的方式：<span color="red">4 种</span>（本页详细展开前两种）。

### 2.1 方式一：继承 Thread 类，重写 run() 方法

创建线程分 2 步：

1. 确定线程要执行什么
2. 启动这个线程

编写一个类，直接继承 `java.lang.Thread` 类，重写 `run` 方法。<span color="red">重写 `run()` 方法是登记任务</span>。

![继承 Thread 类并重写 run 方法](/images/java/thread-extends-class.png)

你创建一个继承了 Thread 的类的对象：

```java
MyThread mt = new MyThread();
```

**如果调用 `mt.run();`** —— 注意：这只是简单调用方法，<span color="red">仍然是单线程</span>。

主线程走到这一行，给 `run()` 方法创建栈帧压栈执行，不会创建新线程。

当 run 方法中的代码跑完，主线程 pop 已经被执行完的 `run()` 方法栈帧，再继续执行 main 方法的栈帧，也就是 main 方法中剩下的代码，所以代码从上到下顺序执行。

```java
package javaExercise.src.Thread_prac;

public class MyThread extends Thread {
    private int Price;

    public int getPrice() {
        return Price;
    }

    public void setPrice(int price) {
        Price = price;
    }

    public MyThread(int price) {
        Price = price;
    }

    @Override
    public void run() {
        // 要执行的代码
        for (int i = 0; i < 3; i++) {
            System.out.println("MyThread i开始执行");
        }
    }

    public static void main(String[] args) {
        MyThread MT = new MyThread(100);
        MT.run();
        for (int i = 0; i < 5; i++) {
            System.out.println(i);
        }
    }
}
```

![mt.run() 的执行结果](/images/java/thread-run-result.png)

<span color="red">`mt.start()` 方法的作用是：启动一个分支线程</span>，在 JVM 中开辟一个新的栈空间。

这段代码任务完成开辟空间之后瞬间就结束。

举个例子，当 main 方法运行到这里了，在另外开辟一个栈空间，开辟空间之后 start 这方法就结束了。

启动成功的线程会自动调用 `run()` 方法并执行（也就是说，在分支栈空间里，为 run 方法创建栈帧，并压栈执行，此时 `run()` 栈帧在分支栈的底部）。

在分支线程的栈执行 `run()` 方法的时候，主线程继续运行 `start()` 代码后面的代码。

![start() 开辟新栈空间（一）](/images/java/thread-start-1.png)

![start() 开辟新栈空间（二）](/images/java/thread-start-2.png)

![start() 开辟新栈空间（三）](/images/java/thread-start-3.png)

值得注意的是：

1. 你不用 start 方法就不可能创建第二个线程（也不可能开辟第二个栈空间）
2. `start()` 方法结束的很快，一旦开辟了新的栈空间就结束，不会等 `run()` 运行完，主线程就去做下一行代码

![start() 的注意事项](/images/java/thread-start-note.png)

对于<span color="red">单核 CPU</span> 来说做不到多线程并发；对于<span color="red">多核 CPU</span> 来说做得到多线程并发。

### 2.2 方式二：实现 Runnable 接口

编个类，实现 `java.lang.Runnable` 接口，实现 run 方法。

注意，实现了接口的对象，就属于这个接口类型，也就是说 Thread_prac2 类的对象属于 Runnable 类，这是在设计一个能存储任务的类。

![实现 Runnable 接口](/images/java/thread-runnable.png)

然后：

```java
Thread t = new Thread(new Thread_prac2());
```

这是在创建一个线程，用的是有参构造函数，这个参数就是一个 Runnable 对象。

这样 `t.start();` 就能创建一个新的栈，并且在里面运行你自己定义的 `run()` 方法。

如果你只是 `Thread t = new Thread();`，这样调用 `run()` 方法调用的就是 `Thread()` 自己的 run，相当于一个线程没有任务。

```java
package javaExercise.src.Thread_prac;

public class Thread_prac2 implements Runnable {
    public void run() {
        System.out.println("Thread_prac2 implements Runnable类正在运行");
    }

    public static void main(String[] args) {
        Thread_prac2 Tp = new Thread_prac2();// 先创建一个 Runnable 对象
        Thread T = new Thread(Tp);
        T.start();// Thread_prac2 implements Runnable类正在运行
    }
}
```

---

## 三、线程的生命周期

刚 new 出来的对象：是<span color="red">新建态</span>；调用 start 方法变<span color="red">成就绪态</span>（就绪态称作可运行态，表示它有可抢夺 CPU 时间片的权）；就绪态抢到时间片之后执行 `run()`，进入<span color="red">运行态</span>；当运行态的线程 CPU 时间片用完了就去就绪态。

线程的执行路径就是依次执行指令。方法或者代码块是组织字节码指令的容器，线程必须进入方法，才能够获取并执行其中的指令。当方法或者代码块被 `synchronized` 修饰的时候，JVM 要求线程在进入之前必须获取对应的<span color="red">监视器锁</span>，没有获取到锁的线程无法执行该段指令，因此被阻塞，进入锁池。

### 3.1 锁池

锁池：在这里找共享对象的对象锁线程，进入锁池。

**`synchronized` 锁机制（锁池 Lock Pool）**

当多个线程同时尝试进入一个被 `synchronized` 修饰的代码块或者方法时，如果锁已经被其他线程持有，这些没抢到锁的线程就会进入到某个对象的锁池；进入锁池的线程释放占用的 CPU 时间片，直到它们找到锁，再转到就绪态去抢 CPU 时间片。

### 3.2 线程 3 大特征

<span color="red">原子性、可见性、有序性</span>。

---

## 四、常用方法

### 4.1 获取当前线程：currentThread()

![currentThread() 示例](/images/java/thread-current-thread.png)

`currentThread()` 返回**正在执行这一行代码的那个线程**。这一行可以在 `run()` 里，也可以在 `main` 里，也可以在任何一个普通方法里。

依据只有一个：<span color="red">调用 `currentThread()` 这行代码，此刻在哪个线程里跑</span>。

- `run()` 由子线程执行，所以在 `run()` 里调 `currentThread()`，返回子线程
- `main` 由主线程执行，所以在 `main` 里调，返回主线程

### 4.2 sleep 方法

- 是静态方法
- 参数是毫秒
- 作用：让当前线程进入休眠、阻塞状态，放弃占有的 CPU 时间片，给其他线程使用

---

## 五、从代码到运行

你写了一个 Main.java 文件：

1. **编译**：<span color="red">javac</span> 编译器读取 Main.java，生成 Main.class 文件。
2. **启动**：执行 `java Main` 指令，操作系统会创建一个 JVM 进程，并为其分配内存。
3. **加载**：<span color="red">JVM 类加载器</span>会将 Main.class <span color="red">加载到内存的方法区</span>当中。
4. **运行**：JVM 创建一个主线程，主线程开始从方法区读取 main 方法的字节码指令，并且逐条执行，执行过程中，会在主线程的虚拟机栈中压入一个个栈帧。

注意：

- main 方法被调用的时候会占据主线程虚拟机栈（线程的私有内存区域，生命周期与线程相同）的一个栈帧，这是主线程栈中的最底层的栈帧
- JVM 启动以后，主线程被创建并启动，JVM 调用 main 方法；每当一个方法被调用，JVM 就会在当前线程的虚拟机栈中压入一个对应的栈帧。边界条件是 main 方法执行完毕的时候 main 方法的栈帧才会被弹出，主线程随之结束

---

## 六、JVM 内存中的堆、栈和方法区

| 区域 | 是否共享 | 存储内容 |
|------|----------|----------|
| 方法区 | 所有线程共享 | 存储已经被 JVM 加载的类信息（类的结构、字段、方法字节码）、运行时常量池（存放编译器生成的各种字面量和符号引用的内存区域）、静态变量（static 修饰的变量）、即时编译器编译后的代码缓存 |
| 堆 | 所有线程共享 | 存储所有 new 出来的对象实例和数组；是垃圾回收器的主要管理区域，线程安全问题多发于此 |
| 虚拟机栈 | 每个线程独享 | 线程每调用一个方法，就往虚拟机栈中压入一个栈帧；栈帧包括局部变量表（存放方法的参数和调用的临时数据）、动态链接（指向该方法在方法区的字节码引用）、方法返回地址（方法执行完之后，返回到调用处的地址），方法返回之后栈帧弹出 |
| 程序计数器 | 每个线程独享 | 极小内存空间，记录当前线程进行到哪一条字节码指令的地址，如果执行的是本地方法（native Method）值为空 |
