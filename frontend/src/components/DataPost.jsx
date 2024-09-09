import React, { useState, useEffect } from "react";
import "./DataPost.css";

function DataPost({ timestamp }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date().getTime();
      const postDate = new Date(timestamp);
      const differenceInMilliseconds = now - postDate;
      const seconds = Math.floor(differenceInMilliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setTimeAgo(`postado   
 há ${days} dias`);
      } else if (hours === 1) {
        setTimeAgo(`Há ${hours} hora`);
      } else if (hours > 1) {
        setTimeAgo(`Há ${hours} horas`);
      } else if (minutes > 0) {
        setTimeAgo(`Há ${minutes} minutos`);
      } else {
        setTimeAgo(`Há ${seconds} segundos`);
      }
    };

    calculateTimeAgo();
    // Atualizar a cada minuto para garantir a precisão
    const interval = setInterval(calculateTimeAgo, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div id="dateTime">
      <p>{timeAgo}</p>
    </div>
  );
}

export default DataPost;
