import React, { useState } from 'react'
import Slider from "react-slick";
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ color:'gray', fontSize:'2.5rem'}}
        onClick={onClick}>
            <BiChevronRight/>
        </div>    
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ color:'gray', fontSize:'2.5rem'}}
        onClick={onClick}>
            <BiChevronLeft/>
        </div>
    );
  }

const HeaderPage = () => {
    const [images, setImages] =useState([
        '/image/header01.png',
        '/image/header02.png',
        '/image/header03.png',
        '/image/header04.png',
    ]);
  
        const settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />
        };

        return (
            <div className="slider-container">
              <Slider {...settings}>
                {images.map(img=>
                    <img src={img} key={img} width='100%'/>
                )}
              </Slider>
            </div>
          );
    }


export default HeaderPage