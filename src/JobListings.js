import React, { useState, useEffect } from 'react';
import './App.css';
import './JobListings.css'
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Link } from 'react-router-dom';
import SearchIcon from './search.svg';

const JobsListings = () => {
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
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  // useEffect(() => {
  //   const savedSearchQuery = localStorage.getItem('searchQuery');
  //   setSearchQuery(savedSearchQuery || '');

  //   const apiUrl = `https://backend.cappsule.co.in/api/v1/new_search?q=${encodeURIComponent(savedSearchQuery)}&pharmacyIds=1,2,3`;

  //   fetch(apiUrl)
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data && data.data && data.data.saltSuggestions) {
  //         setJobs(data.data.saltSuggestions);
  //       }
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching jobs listings:', error);
  //       setLoading(false);
  //     });
  // }, []);

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
    setLoading(true); // Set loading state to true before making the API call
    fetchJobs();
  };

  console.log("jobs", jobs)
  console.log("Strength", jobs.Strength)

  useEffect(() => {
    const savedSearchQuery = localStorage.getItem('searchQuery');
    setSearchQuery(savedSearchQuery || '');
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

  useEffect(() => {
    const skeletonTimer = setTimeout(() => {
      setSkeletonLoading(false);
    }, 3000);

    return () => {
      clearTimeout(skeletonTimer);
    };
  }, []);


  const extractjobsOverview = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const jobsOverview = doc.getElementById('jobs-overview');
    return jobsOverview ? jobsOverview.innerHTML : '';
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.value);
  };
  const handleClearLocation = () => {
    setSelectedLocation(null);
  };
  // const filteredjobs = jobs.filter((jobs) =>
  //   (!selectedLocation || jobs.location.state === selectedLocation.title) &&
  //   (!selectedDepartment || jobs.department === selectedDepartment.title) &&
  //   (!selectedFunction || jobs.function === selectedFunction.title)
  // );
  return (
    <div>
      <div className="a" style={{ backgroundColor: 'rgb(255,255,255)' }}>
        <div className="container">
          <h2>Cappsule web development test</h2>
          <div className="search-bar" style={{ border: '1px solid #ccc', borderRadius: '20px',boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <img src={SearchIcon} alt="Search Icon" style={{ marginRight: '10px', width: '20px', height: '20px',marginLeft :'10px' }} />
            <input
              type="text"
              placeholder="Type your medicine name  here ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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


              {jobs.map(jobs => (

                <div key={jobs.id} className="p-col-12 p-md-6 p-lg-4">
                  <Card title={jobs.title} className="p-shadow-3">
                    <div>
                      <div>
                        <strong>Form:</strong>
                        <button className="custom-button">
                          {jobs.most_common ? jobs.most_common.Form : 'N/A'}
                        </button>
                      </div>
                      <div>
                        <strong>Strength:</strong>
                        <button className="custom-button">
                          {jobs.most_common ? jobs.most_common.Strength : 'N/A'}
                        </button>
                      </div>
                      <div>
                        <strong>Packing:</strong>
                        <button className="custom-button">
                          {jobs.most_common ? jobs.most_common.Packing : 'N/A'}
                        </button>
                      </div>
                    </div>
                    {/* Display buttons next to each other with a little space */}
                    <div style={{ display: 'flex' }}>
                      {/* <a
                        href={jobs.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-button p-button-success shadow-button"

                        style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center', textDecoration: 'none', backgroundColor: '#0973f8', }}


                      >
                        <i className="pi pi-check" style={{ marginRight: '0.3rem' }} /> Apply
                      </a> */}
                      {/* <Link
                        to={`/view/${jobs.id}`}
                        className="p-button p-button-secondary shadow-button"
                        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                      >
                        <i className="pi pi-eye" style={{ marginRight: '0.3rem' }} /> View
                      </Link> */}
                    </div>
                  </Card>
                </div>

              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsListings;
