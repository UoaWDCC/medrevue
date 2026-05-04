import './Card.css'

export default function Card({ info }) {
    
    return(
        
        <div className="ticket">
            <p>{info.name}</p>
        </div>
        
    )
        
}