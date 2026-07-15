#### 基础语法

一个文件只能有一个 public 类，而且文件名必须和这个类名一致
ain 方法是程序的唯一入口，签名必须是 public static void main(String[] args)，一个字都不能改
一个文件里可以有多个类，但只有一个能是 public 的。其他类不加 public 修饰符就行


###### 输入
```
Scanner sc = new Scanner(System.in);//要在文档开头加import java.util.Scanner;
```
Scanner常用方法：
next()//读取文本，遇到空格或回车结束
nextInt()//读取一个整数
nextLine()//读取一行
nextDouble()//读取一个浮点数
hasNext()//判断是否还有下一个输入
###### 输出
```
System.out.println();//在控制台打印一整行
System.out.print();//在控制台打印一个字符串，但不会换行
System.out.printf("pi = %.2f\n", pi);//在控制台打印格式化字符串
```

###### 算数
+ - * 加减乘

/
整数除法直接截断小数

%
取余数

++  --
自增 自减

+= -= *= /=
复合赋值

返回布尔值的运算符：==，!=，>，<，>=，<=
逻辑运算符：&&，||，!
三元运算符：条件 ? 值1 : 值2 是 if-else 的简写形式，条件为 true 返回值1，否则返回值2：

数据类型

流程控制
   if
```
if(条件1){
    做事1;}
else if(条件2){
    做事2;}
else{}
```
while
do while
for
for each
switch 适合对一个变量做多个值的判断
必须加break,否则会穿透
```
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
```
// 箭头语法：不需要 break，也不会穿透
        switch (day) {
            case 1 -> System.out.println("星期一");
            case 2 -> System.out.println("星期二");
            case 3 -> System.out.println("星期三");
            default -> System.out.println("其他");
        }
```

数组

封装

继承

多态
抽象类
接口
#### 包与导入
