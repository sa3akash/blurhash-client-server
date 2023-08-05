/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { Blurhash } from "react-blurhash";

// style={{display: !loadedImg?"block":"none"}}
const Image = ({ src, hash }) => {
  const [loadedImg, setLoadedImg] = useState(false);
  const [url, setUrl] = useState("");
  const imageRef = useRef(null);


  const obserFunction = useCallback(() => {
    const observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {

          setUrl(src);
  
        observer.disconnect();
      }
    }, {});

    if (imageRef && imageRef.current) {
      observer.observe(imageRef.current);
    }
  }, [src]);

  useEffect(() => {
    obserFunction();
  }, [obserFunction]);

  return (
    <div
      className="imageWrap"
      ref={imageRef}
    >
      <Blurhash
        hash={hash}
        width="100%"
        height="100%"
        resolutionX={32}
        resolutionY={32}
        punch={1}
        style={{ display: !loadedImg ? "block" : "none" }}
        className="blurhash_container"
      />

      <img
        src={url}
        alt=""
        width="100%"
        height="100%"
        onLoad={() => setLoadedImg(true)}
      />
    </div>
  );
};

export default Image;
