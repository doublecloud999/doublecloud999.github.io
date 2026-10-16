---
title: "Java 抽象类与接口"
date: 2026-09-21T21:49:02+08:00
draft: false
weight: 26
description: "abstract 抽象类的修饰符限制、抽象方法的定义与实现规则、interface 接口的特性与多实现的解耦价值,以及抽象类与接口的异同和 default 方法冲突。"
tags: ["Java", "抽象类", "接口", "面向对象"]
categories: ["面向对象"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
---

## 一、抽象类:abstract

不能被实例化的类(不能被创建对象),通常包含抽象方法,但也可以有普通方法和字段。

可以写的修饰符:`public` / `protected` / `default`。**严禁**:

- `private`:因为抽象类本身存在的意义就是被子类重写,子类根本看不到 `private` 方法,矛盾,编译报错
- `static`:属于类,不能被子类重写
- `final`:和「抽象方法必须被重写」的要求冲突,编译报错

### 1.1 抽象方法定义

- **没有方法体**(就是只有 `()`,没有 `{}`)的方法,只包含方法名称和参数列表
- 抽象方法必须在抽象类中声明,由具体的子类提供实现

![抽象方法定义](/images/java/abstract-method.png)

### 1.2 子类实现抽象方法

![子类实现抽象方法](/images/java/abstract-impl.png)

1. 继承抽象类
2. 重写抽象方法,并提供抽象方法的具体实现

写抽象类时要想清楚:哪些是子类必须实现的(写成抽象方法);哪些是子类可以直接继承的(写成普通方法)。这是设计层面的难点。

### 1.3 要注意的点

1. 如果一个**非抽象**子类继承了一个抽象父类,它必须重写父类中**所有**的抽象方法;如果继承了抽象父类的子类没有重写所有父类中的抽象方法,那么这个子类必须被声明为抽象类 `abstract`,否则直接编译失败。要求类的继承链在到达末端(可以实例化的具体类)之前,必须完成所有抽象方法的具体实现
2. 抽象方法只有方法名,没有方法体 `{}`,不能被 `private` / `static` / `final` 修饰
3. 抽象类里不一定有抽象方法,但是**可以有构造方法**(供子类 `super()` 调用),用来初始化继承来的字段

```java
abstract class Animal {
    String name;

    Animal(String name) {          // 抽象类的构造方法
        this.name = name;          // 初始化继承给子类的字段
    }
}

class Dog extends Animal {
    Dog(String name) {
        super(name);               // 子类用 super(...) 调用父类构造方法
    }

    @Override
    void eat() {
        System.out.println(name + "吃骨头");   // 这里能用上 name
    }
}

public class Test {
    public static void main(String[] args) {
        Dog dog = new Dog("旺财");
        dog.eat();                 // 输出：旺财吃骨头
    }
}
```

> **一句话总结**:抽象类的构造方法不是用来 new 抽象类自己的,而是子类 new 自己时,由 `super()` 调用来初始化从父类继承的字段。

---

## 二、接口 —— interface 关键字

一种抽象类型,它定义了一组方法,但是没有提供方法的实现;**没有构造方法,不能创建对象**。

类可以实现一个或多个接口,以提供接口定义的方法的具体实现,多个类可以共享一组方法。

接口在字节码中是一个抽象类型,是抽象方法的集合,是一种规范,用 `interface` 关键字定义。接口不能直接实例化,接口中的:

- 变量默认全是 `public static final`
- 方法默认全是 `public abstract`

类 `A` 如果实现了某个接口类 `B`,`A` 只要不是抽象类,就必须实现所有的抽象方法,也可以实现多个接口。

接口能够解决 Java 的单继承限制(单继承就是一个子类只能继承一个父类,Java 为了防止菱形继承的复杂性和二义性,只允许类进行单继承),但是接口可以**多实现**,可以弥补单继承带来的不足。

- 实现多态和**解耦**(解耦指的是降低模块之间的依赖度,让模块与模块之间、类与类之间尽可能独立)
- 类可以实现多个接口
- 一个接口可以继承多个接口

```java
interface A {
    void poor();
}

interface B {
    void rich();
}

interface C extends A, B {
    void human();
}
```

```java
interface USB {
    void connect();
}

class Mouse implements USB {
    public void connect() {
        System.out.println("这是鼠标");
    }
}

class KeyBoard implements USB {
    public void connect() {
        System.out.println("这是键盘");
    }
}

class Computer {
    Computer(USB usb) {
        usb.connect();
    }
}

public static void main(String[] args) {
    Computer c = new Computer(new Mouse());
}
```

- `USB usb`:`USB` 是接口类型,`usb` 是一个引用变量,可以指向任何实现了 `USB` 接口的具体类的对象。它不是子类,而是**父接口引用指向子类对象**
- `USB usb` 在字节码中是局部变量表里的一个引用槽位,可以存放任何实现了 `USB` 接口的对象的地址
- 接口不能直接 new 对象,`USB usb = new USB();` 是报错的,只能 `USB usb = new Mouse();` 这样指向实现类对象
- 在所有实现了接口的类中(`implements`),只有实现了全部接口方法的类才能被创建对象(实例化)

---

## 三、接口和抽象类的异同

| 对比项 | 抽象类 | 接口 |
|--------|--------|------|
| 用途 | 代码复用(需要模板设计、抽取共性的时候) | 定义行为规范(扩展功能) |
| 继承 / 实现 | 只能**单继承** | 可以**多实现**、多继承 |
| 定义关键字 | `abstract class` | `interface` |
| 成员 | 可以有构造器、成员变量、普通方法 | 变量默认 `public static final`,方法默认 `public abstract` |
| 字节码 | 普通的类加上 `ACC_ABSTRACT` 标记 | 单独的标记 |

![接口与抽象类的异同](/images/java/interface-vs-abstract.png)

### 注意:default 方法冲突

- 从 JDK 8 开始,允许接口中定义 `default` 方法(有方法体的方法)
- 如果一个类同时实现了两个接口,而这两个接口都有**同名同参数**的 `default` 方法,编译器就不能确定该用哪一个。这个时候实现类**必须重写**这个冲突的方法,明确指定自己的实现
