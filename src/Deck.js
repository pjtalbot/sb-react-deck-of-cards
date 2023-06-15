import React, { useEffect, useState, useRef } from 'react';
import Card from './Card';
import axios from 'axios';

const API_BASE_URL = 'https://www.deckofcardsapi.com/api/deck/';

const Deck = () => {
	const [ deck, setDeck ] = useState(null);
	const [ drawn, setDrawn ] = useState([]);
	const [ autoDraw, setAutoDraw ] = useState(false);
	const timerRef = useRef(null);

	let drawnArray;

	useEffect(() => {
		async function getData() {
			let d = await axios.get(`${API_BASE_URL}/new`);
			setDeck(d.data);
			console.log(d.data);
		}

		getData();
	}, []);
	// "[setDeck]", is where the dependencies for the hook go

	async function getCard() {
		let { deck_id } = deck;

		try {
			let drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);

			if (drawRes.data.remaining === 0) {
				setAutoDraw(false);
				throw new Error('no cards remaining!');
			}

			const card = drawRes.data.cards[0];

			console.log(card);
			let cardObj = {
				id: card.code,
				name: card.suit + ' ' + card.value,
				image: card.image
			};
			drawnArray = [ ...drawn, cardObj ];

			setDrawn(drawnArray);
		} catch (err) {
			alert(err);
		}
	}

	const toggleAutoDraw = async () => {
		setAutoDraw((prevAutoDraw) => !prevAutoDraw);
	};

	useEffect(
		() => {
			let effect = async () => {
				await handleDraw();
			};

			let intervalId;

			if (autoDraw) {
				intervalId = setInterval(() => {
					effect();

					setDrawn(drawnArray);
					console.log(drawnArray);
				}, 1000);
			}

			return () => {
				clearInterval(intervalId);
			};
		},
		[ autoDraw, setAutoDraw, drawn ]
	);

	// useEffect(() => {
	// 	console.log('drawn changing');
	// }, drawn);
	// useEffect(
	// 	() => {
	// 		const getCard = async () => {
	// 			console.log(deck);
	// 			let { deck_id } = deck;

	// 			try {
	// 				let drawnCard = await axios.get(`${API_BASE_URL}/${deck_id}/draw`);

	// 				let card = drawnCard.data.cards[0];

	// 				setDrawn((d) => [
	// 					...d,
	// 					{
	// 						id: card.code,
	// 						name: `${card.value} of ${card.suit}`,
	// 						image: card.image
	// 					}
	// 				]);
	// 			} catch (e) {
	// 				alert(e);
	// 			}
	// 		};
	// 		getCard();
	// 	},
	// 	[ drawn ]
	// );

	const handleDraw = async () => {
		await getCard();
	};

	let cards = drawn.map((c) => {
		console.log(c);
		console.log(c.id);
		return <Card key={c.id} name={c.name} image={c.image} />;
	});

	return (
		<div className="Deck">
			<button onClick={handleDraw}>Draw</button>
			<button onClick={toggleAutoDraw}>Auto Draw</button>
			<div className="Deck-drawnPile">{cards}</div>
		</div>
	);
};

export default Deck;
