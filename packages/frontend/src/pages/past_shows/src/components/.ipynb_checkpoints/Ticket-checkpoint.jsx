import './Ticket.css'

export default function Ticket({ info }) {
    
    return(
        
        <div className="ticket">
            <p>{info.name}</p>
        </div>
        
    )
        
}