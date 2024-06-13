create table users(
	uid varchar(20) not null primary key,
    uname varchar(20) not null,
    upass varchar(200) not null,
    address1 varchar(500),
    address2 varchar(500),
    phone varchar(20),
    photo varchar(200),
    regDate datetime default now()

);

insert into users (uid, uname, upass) values ('red', '서레드', 'pass');
insert into users (uid, uname, upass) values ('blue', '이블루', 'pass');
insert into users (uid, uname, upass) values ('green', '최그린', 'pass');
insert into users (uid, uname, upass) values ('purple', '유보라', 'pass');
insert into users (uid, uname, upass) values ('admin', '관리자', 'pass');

select * from users;

update users set phone ='010-2020-3030', address1='서울시 금천구 가산동 가산원앤원아파트', address2 ='206동 101호' where uid = 'green';

update users set photo=null where uid = 'green';

create table books(
	bid int auto_increment primary key,
    title varchar(500) not null,
    price int default 0,
    contents text,
    isbn varchar(100),
    publisher varchar(100),
    image varchar(200),
    author varchar(200),
    regDate datetime default now()
);

drop table books;

desc books;

select count(*) from books;

select *, date_format(regDate, '%Y-%m-%d') fmtDate, format(price,0) fmtPrice 
from books order by bid desc
limit 0, 5;

select * from books where bid=84;

alter table books add column updateDate datetime;
desc books;

alter table books add column bigimage varchar(200);


create table likes(
	uid varchar(20) not null,
    bid int not null,
    regDate datetime default now(),
    primary key (uid, bid),
    foreign key(uid) references users(uid),
    foreign key(bid) references books(bid)
);

select * from likes;

select *, date_format(regDate, '%Y-%m-%d') fmtDate, format(price,0) fmtPrice,
(select count(*) from likes where books.bid=likes.bid) lcnt, 
(select count(*) from likes where books.bid=likes.bid and uid='red') ucnt
from books order by bid desc
limit 0, 5;

select *, date_format(regDate, '%Y-%m-%d') fmtDate, format(price,0) fmtPrice,
(select count(*) from likes where books.bid=likes.bid) lcnt, 
(select count(*) from likes where books.bid=likes.bid and uid='red') ucnt
from books where bid=112 ;

create table review(
	rid int auto_increment primary key,
    bid int not null,
    uid varchar(20) not null,
    contents text not null,
    rvDate datetime default now(),
    foreign key(bid) references books(bid),
    foreign key(uid) references users(uid)
);

desc review; 

select * from review;

alter table review add column stars varchar(20);

drop table cart;

drop view view_review;

create view view_review as
select  r.*, u.uname, u.photo, date_format(rvDate, '%Y-%m-%d %T') fmtDate
from review r, users u
where r.uid=u.uid;

select * from view_review where bid=122 order by rid desc limit  0, 3;

 update review set contents='채식은 영원히', rvDate=now() where rid=122 ;

select *, date_format(regDate, '%Y-%m-%d') fmtDate, format(price,0) fmtPrice,
(select count(*) from likes where books.bid=likes.bid) lcnt, 
(select count(*) from likes where books.bid=likes.bid and uid='green') ucnt,
(select count(*) from review where books.bid =review.bid) rcnt
from books order by bid desc
limit 0, 5;

create table cart (
	uid varchar(20) not null,
    bid int not null,
    qnt int default 1,
    regDate datetime default now(),
    primary key (uid, bid),
    foreign key (uid) references users(uid),
    foreign key (bid) references books(bid)
    
);

desc cart;

select * from cart;

create view view_cart as
select c.*, b.title, b.image, b.publisher, b.author, b.price
from cart c, books b
where c.bid = b.bid
order by c.regDate desc;

select * from view_cart;

select * from view_cart where uid='green';


/*주문자정보*/
create table purchase( 
   pid char(13) not null primary key,
    uid varchar(20) not null,
    uname varchar(20) not null,
    phone varchar(20) not null,
    address1 varchar(500) not null,
    address2 varchar(500) not null,
    pdate datetime default now(),
    sum int default 0,
    status int default 0, /*0:결제대기,1:결제확인,2:배송준비,3:배송완료, 4.주문완료*/
    foreign key(uid) references users(uid)
);

desc purchase;
drop table purchase;

/*주문상품 정보*/
create table orders(
   pid char(13) not null,
    bid int not null,
    price int default 0,
    qnt int default 0,
    primary key(pid, bid),
    foreign key(pid) references purchase(pid),
    foreign key(bid) references books(bid)
);




select * from orders;

select o.* , b.title, b.image 
from orders o, books b 
where o.bid = b.bid and pid = '1ab8d485-1f28';

select * from purchase;
delete from cart where uid='red' and bid='113';
delete from purchase where pid >'' ;

select *,  date_format(pdate, '%Y-%m-%d %T') as fmtdate, format(sum, 0) as fmtsum
from purchase 
where uid ='red';

select * ,  date_format(pdate, '%Y-%m-%d %T') as fmtdate, format(sum, 0) as fmtsum
from purchase where uname like '%서%'
order by pdate desc limit 0, 5;

select *, date_format(regDate, '%Y년%m월%d일 %T') as fmtdate from users order by regDate desc;

select *, date_format(regDate, '%Y년%m월%d일 %T') as fmtdate from users where uid='indigo';

insert into users(uid, upass, uname) value ('ella','pass','이엘라');

update users set uname='민분홍', address1='서울시 마포구 신도림동 자이포레씨엘아파트', address2='203동 102호', phone='010-5688-5753' where uid='pink';

delete from users where uid = 'indigo';

select count(*) as total from users;


create table bbs(
	bid int auto_increment primary key,
    title varchar(500) not null,
    contents text,
    uid varchar(20) not null,
    regDate datetime default now(),
    foreign key(uid) references users(uid)
);

desc bbs;

insert into bbs (title, uid) values('Spring의 이유와 목적 필요성에 대한 이야기','red');
insert into bbs (title, uid) values('Spring이란 무엇인가?','blue');
insert into bbs (title, uid) values('Spring은 왜 많이 사용하는가?','green');
insert into bbs (title, uid) values('Spring이란 어떤 기능을 제공할까?','black');
insert into bbs (title, uid) values('Spring의 사용법','blue');
insert into bbs (title, uid) values('회사는 아직도 spring을 사용한다.','purple');


insert into bbs (title, uid)
select title, uid from bbs;

select count(*) from bbs;

create view view_bbs as
select b.*, u.uname, u.photo from bbs b, users u where b.uid=u.uid;

select * from view_bbs;

select bid, viewcnt from bbs where bid=250;

select *, date_format(regDate, '%Y년%m월%d일 %T') as fmtdate from view_bbs where uname like '%이%' order by bid desc limit 0, 5;

update bbs set contents='타임리프에서 a태그를 사용시, 파라미터로 넘길 시 th:href="@{/hello/{param1}/{param2}(param1=${param1}, param2=${param2})}"
/hello/data1/data2를 사용한다. ' where bid=218;

alter table bbs add column viewcnt int default 0;

drop view view_bbs;


create table reply(
	rid int auto_increment primary key,
    bid int not null,
    uid varchar(20) not null,
    regDate datetime default now(),
    contents text,
	foreign key (bid) references bbs(bid),
    foreign key (uid) references users(uid)
);

select * from reply;

insert into reply (bid, uid, contents)
select bid, uid, contents from reply;

select count(*) from reply;

select r.*, u.uname, u.photo  from reply r, users u where r.uid = u.uid;