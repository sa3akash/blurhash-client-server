import { useEffect, useState } from "react";
import "./App.css";
import Image from "./Image";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const submitImage = async () => {
    if (!file) return alert("Please enter a file");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        "http://localhost:5500/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImages((prev) => [...prev, data]);
      setFile(null);
    } catch (Err) {
      console.log(Err);
    }
  };

  //
  // get images
  //

  const getImages = async () => {
    try {
      const { data } = await axios.get("http://localhost:5500/api/getImage");
      setImages(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <>
      <div className="submit_image">
        <input type="file" name="" id="" onChange={handleFile} />
        <button onClick={submitImage}>Submit</button>
      </div>

      <div className="images_wrapper">
        {images &&
          images.map((item, index) => (
            <Image
              key={index}
              src={`http://localhost:5500/${item.url}`}
              hash={item.hash}
            />
          ))}
      </div>
    </>
  );
}

export default App;
