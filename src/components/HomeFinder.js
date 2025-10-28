import React, { useState } from 'react';
import { formatCurrency } from '../utils/currency';
import '../styles/HomeFinder.css';

const MOCK_HOMES = [
  {
    id: 1,
    price: 385000,
    address: '123 Oak St, Austin, TX 78701',
    beds: 3,
    baths: 2,
    sqft: 1650,
    img: 'https://via.placeholder.com/300x200/4f46e5/white?text=Home+1',
  },
  {
    id: 2,
    price: 420000,
    address: '456 Maple Ave, Austin, TX 78702',
    beds: 4,
    baths: 2.5,
    sqft: 2100,
    img: 'https://via.placeholder.com/300x200/7c3aed/white?text=Home+2',
  },
  {
    id: 3,
    price: 355000,
    address: '789 Pine Rd, Austin, TX 78704',
    beds: 3,
    baths: 2,
    sqft: 1450,
    img: 'https://via.placeholder.com/300x200/10b981/white?text=Home+3',
  },
];

const HomeFinder = ({ formData }) => {
  const [zipCode, setZipCode] = useState('');
  const [homes] = useState(MOCK_HOMES);

  return (
    <div>
      <div className="affordability-banner">
        <h2>Your Budget</h2>
        <p className="big-price">{formatCurrency(formData.affordableHome)}</p>
        <p>Max home price</p>
      </div>

      <div className="card">
        <label className="label">Search by Zip Code</label>
        <div className="search-bar">
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="e.g. 78701"
            className="input"
          />
          <button className="btn-primary">Search</button>
        </div>

        <div className="home-grid">
          {homes.map((home) => (
            <div key={home.id} className="home-card">
              <img src={home.img} alt="Home" />
              <div className="home-info">
                <p className="price">{formatCurrency(home.price)}</p>
                <p className="address">{home.address}</p>
                <p className="details">
                  {home.beds} bed • {home.baths} bath • {home.sqft} sqft
                </p>
                <span
                  className={`tag ${
                    home.price <= formData.affordableHome
                      ? 'affordable'
                      : 'over'
                  }`}
                >
                  {home.price <= formData.affordableHome
                    ? 'Within Budget'
                    : 'Over Budget'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFinder;
