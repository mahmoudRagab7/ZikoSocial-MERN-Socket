import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src="https://media.istockphoto.com/id/1483233750/photo/couple-of-business-persons-walking-together-and-talking.jpg?s=612x612&w=0&k=20&c=SN9jxBW1cufyKm3G1Iqv_Se2xCMVluzifNgC0xc76Vs="
          alt="messageImg"
          className="messageImg"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
