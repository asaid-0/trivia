import React from 'react';

export default ({ id, type, handleChange, active }) => (
    <li key={ id } onClick={ () => { handleChange(id) } }>
        <span style={active ? {backgroundColor: 'coral'} : null}>{ type }</span>
    <img className="category" src={`${type.toLowerCase()}.svg`}/>
    </li>
);