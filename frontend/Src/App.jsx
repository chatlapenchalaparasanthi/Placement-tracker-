import { useState, useEffect } from 'react'

function App(){
  const [companies, setCompanies] = useState([]);
  useEffect(()=>{
    fetch('https://placement-tracker333.onrender.com/api/companies')
    .then(r=>r.json()).then(d=>setCompanies(d)).catch(()=>setCompanies([
      {name:'TCS', role:'Software Engineer', ctc:'7 LPA'},
      {name:'Infosys', role:'System Engineer', ctc:'6.5 LPA'}
    ]))
  },[])

  return (
    <div style={{fontFamily:'sans-serif', padding:'20px', background:'#f5f7ff', minHeight:'100vh'}}>
      <h1>🎓 Placement Tracker 333</h1>
      <p>Live: https://placement-tracker333.onrender.com</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:'20px', marginTop:'20px'}}>
        {companies.map((c,i)=>(
          <div key={i} style={{background:'white', padding:'20px', borderRadius:'12px'}}>
            <h2>{c.name}</h2>
            <p>Role: {c.role}</p>
            <p>CTC: {c.ctc}</p>
            <button style={{background:'#2563eb', color:'white', border:'none', padding:'10px 15px', borderRadius:'8px'}}>Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App
