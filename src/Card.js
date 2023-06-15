import React, { useState } from 'react';

const Card = ({ name, image }) => {
	console.log(image);

	return <img className="Card" alt={name} src={image} />;
};

export default Card;
