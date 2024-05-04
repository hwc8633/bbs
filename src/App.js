import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Top from './\bcomponents/Top';
import { Container} from 'react-bootstrap'
import Bottom from './\bcomponents/Bottom';
import About from './\bcomponents/About';
import Menu from './\bcomponents/Menu';

function App() {
	return (
		<Container className="App">
			<Top/>
			<Menu/>
			<Bottom/>
		</Container>
	);
}

export default App;
