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
update users set photo='/upload/photo/a01.png' where uid='red';

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

select count(*) from view_reply;

select * from view_reply;

drop view view_reply;

create view view_reply as
select r.*, u.uname, u.photo, date_format(r.regDate, '%Y년%m월%d일 %T') as fmtdate, date_format(r.updateDate, '%Y년%m월%d일 %T') as fmtUpdate
from reply r, users u where r.uid = u.uid;

update reply set contents='스프링 정말 어렵긴 하네요', regDate=now() where rid=183; 

select * from view_reply where bid=218 order by rid desc limit 0,5;

alter table reply add column updateDate datetime;
alter table bbs add column replyCnt int default 0;
alter table reply add column rating int default 0;
desc reply;

desc view_reply;

update reply set rating=3 where bid > 0;

select rid, rating from reply;

update bbs set replyCnt=(select count(*) from reply where bbs.bid=reply.bid) where bid>0;

update users set photo=null where uid > '';


create table messages (
	mid int auto_increment primary key,
    sender varchar(20) not null,
    receiver varchar(20) not null,
	message text,
    sendDate datetime default now(),
    readData datetime, 
    foreign key (sender) references users(uid),
    foreign key (receiver) references users(uid)

);

desc messages;

select * from messages;

alter table users add column point int default 0;
alter table messages drop column point;
alter table messages add column sendDelete int default 0;
alter table messages add column ReceiveDelete int default 0;

select uid, point from users where uid='blue';


/*보낸메세지*/
select m.*, u.uname, u.photo from messages m, users u where m.receiver = u.uid and mid=1;

/*받은메세지*/
select m.*, u.uname, u.photo from messages m, users u where m.sender = u.uid and mid=1;

/*보낸메시지목록*/
select m.*, u.uname from messages m, users u where sender='blue' and u.uid=m.receiver order by mid desc;

/*받은메시지목록*/
select m.*, u.uname from messages m, users u where receiver='blue' and u.uid=m.sender order by mid desc;

select m.*, u.uname from messages m, users u where receiver='red' and u.uid=m.sender and receiveDelete=0 order by mid desc;
select * from (select m.*, u.uname from messages m, users u where u.uid=m.receiver or u.uid=m.sender) as messageDelete 
where (sendDelete=1 or ReceiveDelete=1) and uname='서레드' ;

/*휴지통목록*/
select * from messages where (sender='red' or receiver='red') and (sendDelete=1 or ReceiveDelete=1);

drop table account;
create table account(
	ano char(4) primary key not null,
    uid varchar(20),
    openDate datetime default now(),
    balance double default 0, /*잔액*/
    foreign key (uid) references users(uid)
);

desc account;

drop table trade;
create table trade(
	tid int auto_increment primary key,
	ano char(4) not null,
    tno char(4) ,
    amount double, /*거래시 금액*/
    tradeDate datetime default now(),
    type int default 1, /*1:입금 -1:출금 */
    foreign key(ano) references account(ano),
    foreign key(tno) references account(ano)
);

desc trade;

/*통장개설*/
insert into account (ano, uid) values ('A001', 'red');
insert into account (ano, uid) values ('A002', 'blue');
insert into account (ano, uid) values ('A003', 'black');

select * from account;

/*내통장에 입금*/
insert into trade(ano, amount) values ('A001', 2000);
update account set balance=balance + 2000 where ano='A001';

/*내통장에 출금*/
insert into trade(ano, amount, type) values ('A001', 1000, -1);
update account set balance=balance - 1000 where ano='A001';

/*A001 이 A002로 500원 이체*/
insert into trade(ano, tno, amount, type) value ('A001', 'A002', 500, -1); 
insert into trade(ano, tno, amount, type) value ('A002', 'A001', 500, 1); 
update account set balance=balance + 500 where ano='A002';
update account set balance=balance - 500 where ano='A001';


select *, format(amount, 0) fmtAmount from trade where ano='A002';

/*tno가 전부 나올 수 있게 left 조인*/
select trade.*, format(amount,0) fmtAmount, uid
from trade left join account
on trade.tno=account.ano where trade.ano='A001';