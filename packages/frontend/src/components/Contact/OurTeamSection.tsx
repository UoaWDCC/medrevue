// import jazzHands from '../../assets/medrevue-sponsorus-jazzHands.png';
import { useGetTeamQuery } from '../../services/cms/cmsApi';
import type { TeamMember } from '../../services/cms/models/Team';

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

const TeamMemberSkeleton: React.FC = () => {
  return (
    <div className="bg-background-secondary rounded-lg shadow-md p-4 flex flex-col items-center text-center w-50">
      <div className="w-40 h-32 mb-3 rounded-lg bg-gray-200 animate-pulse" />

      <div className="w-28 h-5 mb-2 rounded bg-gray-200 animate-pulse" />

      <div className="w-20 h-4 rounded bg-gray-200 animate-pulse" />
    </div>
  );
};

export const OurTeamSection: React.FC = () => {
  const { data: team, isLoading, isError } = useGetTeamQuery();

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
        {isLoading &&
          Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((id) => (
            <TeamMemberSkeleton key={id} />
          ))}

        {!isLoading &&
          !isError &&
          team?.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
      </div>

      {isError && <div className="text-center">Unable to load team.</div>}

      <br />
    </>
  );
};
