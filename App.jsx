import React, { useMemo, useState } from 'react';

const guestDatabase = [
  {
    searchNames: ['gabriela perez', 'ethan smith'],
    partyName: 'Perez Party',
    guests: [
      { name: 'Gabriela Perez', attending: true, meal: '' },
      { name: 'Ethan Smith', attending: true, meal: '' },
      { name: 'Maria Perez', attending: true, meal: '' },
    ],
  },
  {
    searchNames: ['john rodriguez'],
    partyName: 'Rodriguez Party',
    guests: [
      { name: 'John Rodriguez', attending: true, meal: '' },
      { name: 'Ana Rodriguez', attending: true, meal: '' },
    ],
  },
];

const meals = ['Lone Star Supper', 'The Cuban Table'];

export default function App() {
  const [query, setQuery] = useState('');
  const [party, setParty] = useState(null);
  const [partyGuests, setPartyGuests] = useState([]);
  const [message, setMessage] = useState('');

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  function findParty() {
    const match = guestDatabase.find((entry) => entry.searchNames.includes(normalizedQuery));
    if (!match) {
      setParty(null);
      setPartyGuests([]);
      setMessage('We could not find that name. Please try the exact first and last name listed on your invitation.');
      return;
    }
    setParty(match);
    setPartyGuests(match.guests.map((guest) => ({ ...guest })));
    setMessage('');
  }

  function updateGuest(index, field, value) {
    setPartyGuests((current) => current.map((guest, i) => (i === index ? { ...guest, [field]: value } : guest)));
  }

  function submitRSVP() {
    const attendingGuests = partyGuests.filter((guest) => guest.attending);
    const missingMeal = attendingGuests.some((guest) => !guest.meal);
    if (missingMeal) {
      setMessage('Please choose a meal for each guest who is attending.');
      return;
    }
    setMessage('Your RSVP has been recorded. In a real version, this would save to a spreadsheet or database.');
  }

  return (
    <div className="page">
      <div className="container">
        <section className="hero">
          <p className="eyebrow">Wedding RSVP</p>
          <h1>Gabriela &amp; Ethan</h1>
          <p className="intro">Enter your first and last name to find your invitation and RSVP for your party.</p>
        </section>

        <section className="grid two-col">
          <div className="card">
            <h2>Find Your Invitation</h2>
            <label htmlFor="guestName">Full Name</label>
            <input
              id="guestName"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter first and last name"
            />
            <button onClick={findParty}>Search Guest List</button>
            {message && <p className="helper">{message}</p>}
          </div>

          <div className="card">
            <h2>Wedding Day</h2>
            <div className="detail-block">
              <strong>Ceremony · 1:00 PM</strong>
              <p>St. Thomas Aquinas Catholic Church<br />700 Brown Chapel Rd, St. Cloud, FL 34769</p>
            </div>
            <div className="detail-block">
              <strong>Cocktail Hour &amp; Reception · 4:30 PM</strong>
              <p>Sterling Event Venue<br />20524 County Rd 455, Minneola, FL 34715</p>
            </div>
            <div className="detail-block">
              <strong>Dress Code</strong>
              <p>Formal / Black Tie</p>
            </div>
          </div>
        </section>

        {party && (
          <section className="card rsvp-card">
            <h2>{party.partyName}</h2>
            <p className="intro small">Please confirm attendance for each guest and choose a meal for everyone attending.</p>
            <div className="guest-list">
              {partyGuests.map((guest, index) => (
                <div key={guest.name} className="guest-item">
                  <div>
                    <p className="label">Guest Name</p>
                    <p className="guest-name">{guest.name}</p>
                  </div>

                  <div>
                    <p className="label">Attending</p>
                    <label className="check-row">
                      <input
                        type="checkbox"
                        checked={guest.attending}
                        onChange={(e) => updateGuest(index, 'attending', e.target.checked)}
                      />
                      <span>{guest.attending ? 'Attending' : 'Not attending'}</span>
                    </label>
                  </div>

                  <div>
                    <p className="label">Meal Choice</p>
                    <select
                      value={guest.meal}
                      onChange={(e) => updateGuest(index, 'meal', e.target.value)}
                      disabled={!guest.attending}
                    >
                      <option value="">{guest.attending ? 'Select meal' : 'Not needed'}</option>
                      {meals.map((meal) => (
                        <option key={meal} value={meal}>{meal}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={submitRSVP}>Submit RSVP</button>
          </section>
        )}
      </div>
    </div>
  );
}
