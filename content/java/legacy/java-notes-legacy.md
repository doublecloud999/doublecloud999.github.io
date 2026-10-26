---title: "Java 基础笔记"
date: 2026-07-15T22:13:28+08:00
draft: false
description: "Java 平台无关性、加载与执行机制、环境变量、基础语法、数据类型、流程控制,以及面向对象与泛型入门。"
tags: ["Java", "基础语法", "面向对象", "JVM"]
categories: ["Java 基础"]
ShowToc: true
TocOpen: false
ShowReadingTime: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowPostNavLinks: true
aliases: ["/posts/java笔记/"]
---

## 一、前置知识

### 1.1 Java 的平台无关性(跨平台性)

一次编译即可在不同的操作系统中运行。

Java 程序被编译为**字节码**(`.class` 文件)而不是二进制机器码,不同的操作系统下载不同版本的 JVM(Java 虚拟机),再由对应版本的 JVM 将字节码解释为不同的机器码。

> 安装不同版本的 JVM,只需要下载对应版本的 JDK 即可。

### 1.2 垃圾回收机制(Garbage Collection)

Java 的自动内存管理机制:垃圾回收机制可以自动分配和释放内存,程序员无需手动管理。

### 1.3 Java 的加载与执行

- `.java` 文件是源码,其中定义了多个 `class` 类,有几个类就会生成几个 `.class`(字节码)文件。
- 生成 `.class` 文件后,即使把 `.java` 文件删除也不影响执行,但这样就没法再修改源码了。

**javac —— 编译命令**

`javac` 专门负责编译,会检查 `.java` 文件中的代码是否合法:合法则生成字节码文件,不合法则报错。

`javac` 后面跟的是 `.java` 文件的路径,可以是绝对路径也可以是相对路径。比如一个 `.java` 文件中定义了一个叫 `a` 的类,那么 `javac` 就会生成 `a.class`,这是字节码文件,操作系统无法直接运行。

**java —— 运行命令**

`java` 命令用来运行 Java 程序,后面跟的是类名(比如 `java a`)。执行 `java a` 之后:

1. 启动 JVM(Java 虚拟机);
2. 虚拟机内启动类加载器(classloader);
3. 类加载器通过环境变量 `classpath` 去硬盘上找那个叫 `a.class` 的文件;
4. JVM 找到该字节码文件中的 `main` 方法,并将该方法解释成机器码;
5. 操作系统通过执行机器码与底层硬件交互。

> **小结**
> - 编译依赖 `javac.exe` 命令,运行依赖 `java.exe` 命令
> - 编译和运行可以在不同操作系统上进行

### 1.4 PATH 环境变量

这个变量跟 Java 无关,是**操作系统级别**的环境变量。

Windows 系统默认从当前路径开始找命令,如果找不到,就去 PATH 变量中找。只要能找到命令就直接执行,找不到就报错。

### 1.5 classpath

这个环境变量隶属于 Java,与操作系统无关。

类加载器(classloader)从环境变量 `classpath` 中找字节码文件:找到就编译为机器码并执行,找不到就报错。

> 如果没有配置 `classpath`,类加载器默认去当前路径下找字节码文件。

---

## 二、基础语法(Java SE)

### 2.1 类与文件规则

- 一个文件只能有一个 `public` 类,而且**文件名必须和这个类名一致**。
- `main` 方法是程序的唯一入口,签名必须是 `public static void main(String[] args)`,一个字都不能改。
- 一个文件里可以有多个类,但只有一个能是 `public` 的,其他类不加 `public` 修饰符即可。

### 2.2 输入

```java
Scanner sc = new Scanner(System.in);
// 需要在文件开头加上 import java.util.Scanner;
```

`Scanner` 常用方法:

| 方法 | 说明 |
|------|------|
| `next()` | 读取文本,遇到空格或回车结束 |
| `nextInt()` | 读取一个整数 |
| `nextLine()` | 读取一行 |
| `nextDouble()` | 读取一个浮点数 |
| `hasNext()` | 判断是否还有下一个输入 |

### 2.3 输出

```java
System.out.println();                  // 在控制台打印一整行
System.out.print();                    // 打印一个字符串,但不会换行
System.out.printf("pi = %.2f\n", pi);  // 打印格式化字符串
```

### 2.4 随机数

```java
Random r = new Random();
```

三种常见写法:

```java
// 1. 取值范围就是 int 的范围
int a = r.nextInt();

// 2. 取值范围是 0 ~ 98
int a = r.nextInt(99);

// 3. 取值范围是 2 ~ 98
int a = r.nextInt(2, 99);
```

### 2.5 算术运算符

| 运算符 | 说明 |
|--------|------|
| `+` `-` `*` | 加减乘 |
| `/` | 整数除法直接截断小数 |
| `%` | 取余数 |
| `++` `--` | 自增、自减 |
| `+=` `-=` `*=` `/=` | 复合赋值 |

```java
a += 1;
// 等价于 a = a + 1; 其他同理
```

#### 字符运算

ASCII 码表中每一个数字都跟唯一的字符产生对应关系:

- 字符 `0` 从 48 开始
- 字符 `A` 从 65 开始
- 字符 `a` 从 97 开始

### 2.6 其他运算符

**返回布尔值的运算符**

| 运算符 | 说明 |
|--------|------|
| `==` | 判断两端是否相等 |
| `!=` | 判断两端是否不等 |
| `>` | 判断是否左端大于右端 |
| `<` | 判断是否右端大于左端 |
| `>=` | 判断是否左端大于等于右端 |
| `<=` | 判断是否左端小于等于右端 |

**逻辑运算符**

`&&`、`||`、`!`

**三元运算符**

条件 `?` 值1 `:` 值2,是 `if-else` 的简写形式:条件为 `true` 返回值1,否则返回值2。

```java
(a > b) ? a : b
// 如果 a > b 为真则返回 a,为假则返回 b
```

### 2.7 数据类型

**整型**

| 类型 | 大小 | 备注 |
|------|------|------|
| `byte` | 1 字节 | |
| `short` | 2 字节 | |
| `int` | 4 字节 | |
| `long` | 8 字节 | 必须加 `L` 后缀 |

**浮点型**

| 类型 | 大小 | 备注 |
|------|------|------|
| `float` | 4 字节 | 必须加 `f` 后缀 |
| `double` | 8 字节 | |

**字符型**

| 类型 | 大小 | 备注 |
|------|------|------|
| `char` | 2 字节 | 必须用单引号 `''` 括起来,例如 `'A'` |

**布尔型**

| 类型 | 大小 | 备注 |
|------|------|------|
| `boolean` | 理论上 1 位(bit) | 实际大小取决于 JVM 实现 |

### 2.8 流程控制

**if**

```java
if (条件1) {
    做事1;
} else if (条件2) {
    做事2;
} else {
    做事3;
}
```

**while**

```java
while (条件) {

}
```

**do-while**

```java
do {

} while (条件);
```

**for / for-each**

```java
for (int i = 0; i < 10; i++) {

}

for (int x : arr) {

}
```

**switch**

适合对一个变量做多个值的判断。传统写法**必须加 `break`**,否则会穿透。

```java
switch (day) {
    case 1:
        System.out.println("星期一");
        break;
    case 2:
        System.out.println("星期二");
        break;
    case 3:
        System.out.println("星期三");
        break;
    default:
        System.out.println("其他");
        break;
}
```

箭头语法不需要 `break`,也不会穿透:

```java
switch (day) {
    case 1 -> System.out.println("星期一");
    case 2 -> System.out.println("星期二");
    case 3 -> System.out.println("星期三");
    default -> System.out.println("其他");
}
```

**break**

结束整个循环:

```java
for (int i = 1; i < 100; i++) {
    System.out.println(i);
    if (i == 50) {
        break;
    }
}
// 循环停在 50 这一轮,i 不会再增大
```

> 遇到多层循环嵌套时,`break` 默认只结束它所在的那一层循环,外层循环不受影响。

**continue**

结束当前轮次循环:

```java
for (int i = 1; i < 100; i++) {
    if (i == 40) {
        continue;
    }

    System.out.println(i);

    if (i == 50) {
        break;
    }
}
// 当 i == 40 时执行到 continue,这一轮不会再执行下面的语句,
// 所以打印出来的数字没有 40,直接 i++ 到 41 继续打印
```

---

## 三、面向对象与泛型

> 预留章节:数组、封装、继承、多态、抽象类、接口、包与导入。

### 3.1 static

> 待补充。

### 3.2 继承

让你在已有类的基础上扩展新功能。

```java
public class Human {
    private int identity;
    private String name;

    public String getName(Human h) {
        return h.name;
    }
}

public class Man extends Human {

}
```

### 3.3 多态

允许不同类型的对象对同一个方法进行调用,可以通过接口和继承来实现。

### 3.4 abstract(抽象类)

抽象类是不能被实例化的类,用于定义具有共同特征的类的通用结构。抽象类既可以包含抽象方法,也可以包含普通方法和字段。

**抽象方法**:没有方法体的方法,只包含方法名称和参数列表。抽象方法必须在抽象类中声明,由具体的子类提供实现。

### 3.5 接口

接口是一种抽象类型,它定义了一组方法名但没有提供方法的实现。

类可以实现一个或者多个接口,用来提供接口所定义方法的具体实现。

### 3.6 快捷键

`Ctrl + Alt + T`:将选中内容用 `while` / `for` 等流程控制语句包裹。
