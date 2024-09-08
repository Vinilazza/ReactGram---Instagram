import './Message.css'

const Messase = ({msg, type}) => {
  return (
    <div className={`message ${type}`}>
      <p>{msg}</p>
    </div>
  )
}

export default Messase
