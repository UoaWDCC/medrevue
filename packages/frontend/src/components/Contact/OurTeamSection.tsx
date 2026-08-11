import jazzHands from '../../assets/medrevue-sponsorus-jazzHands.png';

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <div className="bg-background-secondary rounded-lg shadow-md p-4 flex flex-col items-center text-center w-50">
      <img
        src={member.image}
        alt={member.name}
        className="w-40 h-32 object-cover mb-3 rounded-lg"
      />

      <p>
        <b>{member.name}</b>
      </p>

      <p className="text-text-brown">
        <i>{member.role}</i>
      </p>
    </div>
  );
};

const teamMembers = [
  {
    title: 'Actors',
    members: [
      {
        name: 'Grace Baek',
        role: 'Actor',
        image: jazzHands,
      },
      {
        name: 'Jess Brewerton',
        role: 'Actor',
        image: '/images/team/jess-brewerton.jpg',
      },
      {
        name: 'Jimmy Austin',
        role: 'Actor',
        image: '/images/team/jimmy-austin.jpg',
      },
      {
        name: 'Ashvin Peiris',
        role: 'Actor',
        image: '/images/team/ashvin-peiris.jpg',
      },
      {
        name: 'Sasan Danawala Gamage',
        role: 'Actor',
        image: '/images/team/sasan-danawala-gamage.jpg',
      },
    ],
  },

  {
    title: 'Dancers',
    members: [
      {
        name: 'Sophie Johnston',
        role: 'Dancer',
        image: '/images/team/sophie-johnston.jpg',
      },
      {
        name: 'Sabrina Joe',
        role: 'Dancer',
        image: '/images/team/sabrina-joe.jpg',
      },
      {
        name: 'Jules Torres',
        role: 'Dancer',
        image: '/images/team/jules-torres.jpg',
      },
    ],
  },

  {
    title: 'Barbershop',
    members: [
      {
        name: 'Dalon Shih',
        role: 'Barbershop',
        image: '/images/team/dalon-shih.jpg',
      },
      {
        name: 'Ethan Moy',
        role: 'Barbershop',
        image: '/images/team/ethan-moy.jpg',
      },
      {
        name: 'Michelle Chan',
        role: 'Barbershop',
        image: '/images/team/michelle-chan.jpg',
      },
    ],
  },

  {
    title: 'Band',
    members: [
      {
        name: 'Cindy Kim',
        role: 'Band',
        image: '/images/team/cindy-kim.jpg',
      },
      {
        name: 'Gloria Lee',
        role: 'Band',
        image: '/images/team/gloria-lee.jpg',
      },
    ],
  },

  {
    title: 'Backstage',
    members: [
      {
        name: 'Carter Wu',
        role: 'Backstage',
        image: '/images/team/carter-wu.jpg',
      },
      {
        name: 'Jade Edwards-Bell',
        role: 'Backstage',
        image: '/images/team/jade-edwards-bell.jpg',
      },
    ],
  },

  {
    title: 'Production',
    members: [
      {
        name: 'Amanda Li',
        role: 'Production',
        image: '/images/team/amanda-li.jpg',
      },
      {
        name: 'Eve Lekach',
        role: 'Production',
        image: '/images/team/eve-lekach.jpg',
      },
      {
        name: 'Kasper Lenoir',
        role: 'Production',
        image: '/images/team/kasper-lenoir.jpg',
      },
    ],
  },
];

const allMembers = teamMembers.flatMap((section) => section.members);

export const OurTeamSection: React.FC = () => {
  return (
    <>
      <br />

      <section className="bg-background-white px-4 mt-5 md:mt-10 text-center">
        <h2 className="text-2xl md:text-3xl leading-none font-semibold font-sans text-black mb-6">
          Our Team
        </h2>
      </section>

      <br />

      <div className="flex flex-wrap justify-center gap-4">
        {allMembers.map((member) => (
          <TeamMemberCard key={member.name} member={member} />
        ))}
      </div>

      <br />
    </>
  );
};
