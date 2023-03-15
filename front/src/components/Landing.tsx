import './Landing.css'

const Landing = () => {
  return (
    <div className="aerohandling-container">
      <div className="aerohandling-header">
        <h1 style={{fontSize:'8vw'}}>Aerohandling</h1>
        <h2 style={{fontSize:'4vw'}}>Ground handling services, TLV airport</h2>
      </div>
      <div className="aerohandling-body">
        <img src='https://www.aerohandling.com/media/small/ezgif-4-a17da02f4a.gif' alt='imgs' className='aerohandling-images'/>
      </div>
    </div>
  )
}

export default Landing