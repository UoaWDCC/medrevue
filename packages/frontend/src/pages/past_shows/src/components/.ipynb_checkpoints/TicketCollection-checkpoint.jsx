import { useEffect, useRef } from 'react'; // Ensure it only runs after the DOM is created
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Ticket from './Ticket.jsx'
import './TicketCollection.css'


gsap.registerPlugin(ScrollTrigger);


export default function TicketCollection() {

    const tickets = [
        { name: 'Hi' },
        { name: 'Bye' },
        { name: 'Goodnight' }
    ];

    const containerRef = useRef(null); // Initialise with { current: null }

    // useEffect(callback, deps)
    //     callback: the function that runs after the component mounts
    //     deps (dependency array): controls when effect re-runs
    useEffect(() => {

        // Scope animation to containerRef
        const ctx = gsap.context(() => {

            // Grab all ticket elements as an array so we can index them
            const ticketsArray = gsap.utils.toArray('.ticket');

            // Set initial position
            gsap.set(
                ticketsArray,
                {
                    zIndex: i => ticketsArray.length - i,
                    y: i => 12 * i,
                }
            )

            // Set scroll animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: `+=${(tickets.length) * window.innerHeight} top`,
                    scrub: 1,
                    pin: true,
                }
            })

            // Set animation for each ticket
            ticketsArray.map(ticket => {
                tl.to(
                    ticket,
                    {
                        y: -window.innerHeight,
                        opacity: 0,
                        ease: 'power2.in',
                    }
                )
            });
            
        }, containerRef);

        // Clean up on unmount (returns a function reference insteads of running it)
        return () => ctx.revert();
        
    }, []);

    return (
        
        <div className="ticket-collection" ref={containerRef}>
            {
                tickets.map(ticket => (
                    <Ticket key={ticket.name} info={ticket} />
                ))
            }
        </div>
        
    )
    
}