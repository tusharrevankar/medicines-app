import React, { useState, useEffect } from 'react';
import './App.css';
import './MedicineListings.css'
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Link } from 'react-router-dom';
import SearchIcon from './search.svg';

const MedicineListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobsIds, setExpandedJobsIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functions, setFunctions] = useState([]);




  const fetchJobs = () => {
    const apiUrl = `https://backend.cappsule.co.in/api/v1/new_search?q=${encodeURIComponent(searchQuery)}&pharmacyIds=1,2,3`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.data && data.data.saltSuggestions) {
          setJobs(data.data.saltSuggestions);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching jobs listings:', error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setLoading(true);
    fetchJobs();
  };

  console.log("jobs", jobs)
  console.log("Strength", jobs.Strength)

  useEffect(() => {
    setSearchQuery('');
  }, []);

  useEffect(() => {

    // Store data in localStorage whenever it changes
    localStorage.setItem('searchQuery', searchQuery);


    // ... Update filteredjobs based on search and dropdown selections ...
  }, [searchQuery, selectedLocation, selectedDepartment, selectedFunction]);

  const handleFunctionChange = (e) => {
    setSelectedFunction(e.value);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.value);
  };





  const extractjobsOverview = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const jobsOverview = doc.getElementById('jobs-overview');
    return jobsOverview ? jobsOverview.innerHTML : '';
  };
  const renderPrice = (price) => {
    return price ? `$${price}` : 'No Stores selling this product near you';
  };

  const renderSaltForms = (saltForms) => {
    return Object.entries(saltForms).map(([form, strengths]) => (
      <div key={form}>
        <strong>{form}:</strong>
        {Object.entries(strengths).map(([strength, packings]) => (
          <li>

            <ul>
              {Object.entries(packings).map(([packing, prices]) => (
                <li key={packing}>
                  {renderPrice(prices && prices[Object.keys(prices)[0]])}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </div>
    ));
  };




  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <div className="a" style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="container">
          <h2>Cappsule web development test</h2>
          <div className="search-bar" style={{ border: '1px solid #ccc', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <img src={SearchIcon} alt="Search Icon" style={{ marginRight: '10px', width: '20px', height: '20px', marginLeft: '10px' }} />
            <input
              type="text"
              placeholder="Type your medicine name  here ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                border: 'none',
                paddingLeft: '10px',
                paddingRight: '10px',
                width: '100%',
                height: '30px',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <span className="clear-icon" onClick={() => setSearchQuery('')}>
                <i className="pi pi-times" />
              </span>
            )}
            <button className="search-button" style={{ color: 'lightgreen', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={handleSearch}>
              Search
            </button>
          </div>



          <div className="card-container">
            <div className="p-grid p-col-gap">
              {loading ? (
                <div className="p-col-12 p-md-6 p-lg-4" style={{ justifyContent: "center" }}>
                  <p>Find medicines with amazing discount</p>
                </div>
              ) : (
                <>
                  {jobs.map(job => (
                    <div key={job.id} className="p-col-12 p-md-6 p-lg-4">
                      <Card
                        title={job.title}
                        className="p-shadow-3"
                        style={{
                          padding: '20px',
                          background: 'linear-gradient(to left, rgba(255, 255, 220, 0.19), rgba(255, 255, 220, 0.069))'
                        }}
                      >
                        <div style={{ display: 'flex' }}>
                          {/* First Column */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '100px', textAlign: 'right' }}>Form:</div>
                                <button className="custom-button">
                                  {job.most_common ? job.most_common.Form : 'N/A'}
                                </button>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '100px', textAlign: 'right' }}>Strength:</div>
                                <button className="custom-button">
                                  {job.most_common ? job.most_common.Strength : 'N/A'}
                                </button>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '100px', textAlign: 'right' }}>Packing:</div>
                                <button className="custom-button">
                                  {job.most_common ? job.most_common.Packing : 'N/A'}
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Second Column */}
                          <div style={{ flex: 1 }}>
                            <div className='salt'>
                              <strong>{job.salt}</strong>
                              <div style={{ color: 'lightgreen', fontSize: '15px' }}>
                                {job.most_common ? `${job.most_common.Form} | ${job.most_common.Strength} | ${job.most_common.Packing}` : 'N/A'}
                              </div>
                            </div>
                          </div>
                          {/* Third Column */}
                          <div style={{ flex: 1 }}>
                            {job.available_forms ? (
                              <strong>{job.salt_forms_json.selling_price || 'No stores selling this product near you'}</strong>
                            ) : (
                              <strong>No stores selling this product near you</strong>
                            )}
                          </div>
                        </div>
                        {/* Display buttons next to each other with a little space */}
                        <div style={{ display: 'flex' }}>

                        </div>
                      </Card>
                    </div>
                  ))}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineListings;
