const teamMembers = [
  {
    title: 'Actors',
    members: [
      { name: 'Grace Baek', role: 'Actor' },
      { name: 'Jess Brewerton', role: 'Actor' },
      { name: 'Jimmy Austin', role: 'Actor' },
      { name: 'Ashvin Peiris', role: 'Actor' },
      { name: 'Sasan Danawala Gamage', role: 'Actor' },
    ],
  },
  {
    title: 'Dancers',
    members: [
      { name: 'Sophie Johnston', role: 'Dancer' },
      { name: 'Sabrina Joe', role: 'Dancer' },
      { name: 'Jules Torres', role: 'Dancer' },
    ],
  },
  {
    title: 'Barbershop',
    members: [
      { name: 'Dalon Shih', role: 'Barbershop' },
      { name: 'Ethan Moy', role: 'Barbershop' },
      { name: 'Michelle Chan', role: 'Barbershop' },
    ],
  },
  {
    title: 'Band',
    members: [
      { name: 'Cindy Kim', role: 'Band' },
      { name: 'Gloria Lee', role: 'Band' },
    ],
  },
  {
    title: 'Backstage',
    members: [
      { name: 'Carter Wu', role: 'Backstage' },
      { name: 'Jade Edwards-Bell', role: 'Backstage' },
    ],
  },
  {
    title: 'Production',
    members: [
      { name: 'Amanda Li', role: 'Production' },
      { name: 'Eve Lekach', role: 'Production' },
      { name: 'Kasper Lenoir', role: 'Production' },
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
          <div
            key={member.name}
            className="bg-background-secondary rounded-lg shadow-md p-4 flex flex-col items-center text-center w-50"
          >
            <div className="w-40 h-32 bg-gray-100 mb-3 rounded-lg" />
            <p>
              <b>{member.name}</b>
            </p>
            <p className="text-text-brown">
              <i>{member.role}</i>
            </p>
          </div>
        ))}
      </div>
      <br />
    </>
  );
};
