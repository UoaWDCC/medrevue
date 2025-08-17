import './styles.css'; // Import the CSS file for styling
import loadingImg from '../../assets/Loading2.gif';

export const LoadingComponent: React.FC = () => {
  return (
    <div className="spinner-container">
      <img src={loadingImg} alt="Loading" />
    </div>
  );
};
