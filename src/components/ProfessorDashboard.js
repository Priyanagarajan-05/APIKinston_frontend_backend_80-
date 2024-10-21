/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfessorDashboard = () => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('create'); // Tab State
    const [courseCreated, setCourseCreated] = useState(false);
    const [courses, setCourses] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [course, setCourse] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        price: '',
        modules: [{ title: '', content: '', order: 1 }]
    });

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5295/api/Courses', {
                title: course.title,
                description: course.description,
                professorId: userId,
                startDate: course.startDate,
                endDate: course.endDate,
                price: course.price,
                modules: course.modules
            });
            setCourseCreated(true);
            alert('Course created successfully!');
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const handleAddModule = () => {
        setCourse({
            ...course,
            modules: [...course.modules, { title: '', content: '', order: course.modules.length + 1 }]
        });
    };

    const handleModuleChange = (index, field, value) => {
        const updatedModules = [...course.modules];
        updatedModules[index][field] = value;
        setCourse({ ...course, modules: updatedModules });
    };

    useEffect(() => {
        // Fetch courses approved by the admin
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5295/api/Courses');
                const approvedCourses = response.data.filter(course => course.isApproved === true && course.professorId === parseInt(userId));
                setCourses(approvedCourses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        // Fetch course reviews
        const fetchReviews = async () => {
            try {
                // API call for fetching reviews, assuming review data exists
                const reviewResponse = await axios.get(`http://localhost:5295/api/Reviews/professor/${userId}`);
                setReviews(reviewResponse.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchCourses();
        fetchReviews();
    }, [userId]);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Professor Dashboard</h2>
            <p style={styles.welcomeMessage}>Welcome, {username}</p>
            <p style={styles.professorInfo}>Email: {email} (User ID: {userId})</p>
            <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>

            <div style={styles.tabs}>
                <button onClick={() => setActiveTab('create')} style={activeTab === 'create' ? styles.activeTab : styles.tab}>Create Course</button>
                <button onClick={() => setActiveTab('myCourses')} style={activeTab === 'myCourses' ? styles.activeTab : styles.tab}>My Courses</button>
                <button onClick={() => setActiveTab('reviews')} style={activeTab === 'reviews' ? styles.activeTab : styles.tab}>Course Review</button>
            </div>

            {}
            {activeTab === 'create' && (
                <div>
                    {!courseCreated ? (
                        <div>
                            <h3 style={styles.subHeading}>Create a Course</h3>
                            <form onSubmit={handleCreateCourse} style={styles.form}>
                                <input
                                    type="text"
                                    placeholder="Course Title"
                                    value={course.title}
                                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                    required
                                    style={styles.input}
                                />
                                <textarea
                                    placeholder="Course Description"
                                    value={course.description}
                                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                    required
                                    style={styles.input}
                                />
                                <input
                                    type="date"
                                    placeholder="Start Date"
                                    value={course.startDate}
                                    onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
                                    required
                                    style={styles.input}
                                />
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    value={course.endDate}
                                    onChange={(e) => setCourse({ ...course, endDate: e.target.value })}
                                    required
                                    style={styles.input}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={course.price}
                                    onChange={(e) => setCourse({ ...course, price: e.target.value })}
                                    required
                                    style={styles.input}
                                />

                                <h4>Modules</h4>
                                {course.modules.map((module, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            placeholder={`Module ${index + 1} Title`}
                                            value={module.title}
                                            onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                                            required
                                            style={styles.input}
                                        />
                                        <textarea
                                            placeholder={`Module ${index + 1} Content`}
                                            value={module.content}
                                            onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                                            required
                                            style={styles.input}
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddModule} style={styles.addButton}>Add Module</button>
                                <button type="submit" style={styles.submitButton}>Create Course</button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h3 style={styles.subHeading}>Course Created Successfully!</h3>
                        </div>
                    )}
                </div>
            )}

{activeTab === 'myCourses' && (
    <div>
        <h3 style={styles.subHeading}>My Approved Courses</h3>
        {courses.length > 0 ? (
            <ul style={styles.courseList}>
                {courses.map((course) => (
                    <li key={course.courseId} style={styles.courseItem}>
                        <h4>{course.title}</h4>
                        <p>{course.description}</p>
                        <p><strong>Start Date:</strong> {course.startDate}</p>
                        <p><strong>End Date:</strong> {course.endDate}</p>
                        <p><strong>Price:</strong> ${course.price}</p>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No courses approved by the admin yet.</p>
        )}
    </div>
)}
            {}
            {activeTab === 'reviews' && (
                <div>
                    <h3 style={styles.subHeading}>Course Reviews</h3>
                    {reviews.length > 0 ? (
                        <ul style={styles.courseList}>
                            {reviews.map((review) => (
                                <li key={review.courseId} style={styles.courseItem}>
                                    <h4>Course: {review.courseTitle}</h4>
                                    <p>Students Enrolled: {review.studentCount}</p>
                                    <p>Rating: {review.rating}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
    },
    heading: {
        fontSize: '24px',
        color: '#333',
    },
    subHeading: {
        fontSize: '20px',
        color: '#555',
    },
    tabs: {
        display: 'flex',
        marginBottom: '20px',
    },
    tab: {
        padding: '10px 20px',
        marginRight: '10px',
        cursor: 'pointer',
        backgroundColor: '#eee',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    activeTab: {
        padding: '10px 20px',
        marginRight: '10px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '5px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginBottom: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
    },
    addButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '10px',
    },
    submitButton: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    courseList: {
        listStyleType: 'none',
        padding: 0,
    },
    courseItem: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    logoutButton: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
};

export default ProfessorDashboard;
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfessorDashboard = () => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('create');
    const [courseCreated, setCourseCreated] = useState(false);
    const [courses, setCourses] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [course, setCourse] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        price: '',
        modules: [{ title: '', content: '', order: 1 }]
    });

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5295/api/Courses', {
                title: course.title,
                description: course.description,
                professorId: userId,
                startDate: course.startDate,
                endDate: course.endDate,
                price: course.price,
                modules: course.modules
            });
            setCourseCreated(true);
            alert('Course created successfully!');
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const handleAddModule = () => {
        setCourse({
            ...course,
            modules: [...course.modules, { title: '', content: '', order: course.modules.length + 1 }]
        });
    };

    const handleModuleChange = (index, field, value) => {
        const updatedModules = [...course.modules];
        updatedModules[index][field] = value;
        setCourse({ ...course, modules: updatedModules });
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5295/api/Courses');
                const approvedCourses = response.data.filter(course => course.isApproved && course.professorId === parseInt(userId));
                setCourses(approvedCourses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const reviewResponse = await axios.get(`http://localhost:5295/api/Reviews/professor/${userId}`);
                setReviews(reviewResponse.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchCourses();
        fetchReviews();
    }, [userId]);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Professor Dashboard</h2>
            <p style={styles.welcomeMessage}>Welcome, {username}</p>
            <p style={styles.professorInfo}>Email: {email} (User ID: {userId})</p>

            <div style={styles.headerRow}>
                <div style={styles.tabs}>
                    <button onClick={() => setActiveTab('create')} style={activeTab === 'create' ? styles.activeTab : styles.tab}>Create Course</button>
                    <button onClick={() => setActiveTab('myCourses')} style={activeTab === 'myCourses' ? styles.activeTab : styles.tab}>My Courses</button>
                    <button onClick={() => setActiveTab('reviews')} style={activeTab === 'reviews' ? styles.activeTab : styles.tab}>Course Review</button>
                </div>
                <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </div>

            {/* Create Course Tab */}
            {activeTab === 'create' && (
                <div>
                    {!courseCreated ? (
                        <div>
                            <h3 style={styles.subHeading}>Create a Course</h3>
                            <form onSubmit={handleCreateCourse} style={styles.form}>
                                <input
                                    type="text"
                                    placeholder="Course Title"
                                    value={course.title}
                                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                    required
                                    style={styles.input}
                                />
                                <textarea
                                    placeholder="Course Description"
                                    value={course.description}
                                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                    required
                                    style={styles.textarea}
                                />
                                <input
                                    type="date"
                                    placeholder="Start Date"
                                    value={course.startDate}
                                    onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
                                    required
                                    style={styles.input}
                                />
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    value={course.endDate}
                                    onChange={(e) => setCourse({ ...course, endDate: e.target.value })}
                                    required
                                    style={styles.input}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={course.price}
                                    onChange={(e) => setCourse({ ...course, price: e.target.value })}
                                    required
                                    style={styles.input}
                                />

                                <h4>Modules</h4>
                                {course.modules.map((module, index) => (
                                    <div key={index} style={styles.moduleContainer}>
                                        <input
                                            type="text"
                                            placeholder={`Module ${index + 1} Title`}
                                            value={module.title}
                                            onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                                            required
                                            style={styles.moduleInput}
                                        />
                                        <textarea
                                            placeholder={`Module ${index + 1} Content`}
                                            value={module.content}
                                            onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                                            required
                                            style={styles.moduleTextarea}
                                        />
                                    </div>
                                ))}
                                <div style={styles.buttonContainer}>
                                    <button type="button" onClick={handleAddModule} style={styles.addButton}>Add Module</button>
                                    <button type="submit" style={styles.submitButton}>Create Course</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h3 style={styles.subHeading}>Course Created Successfully!</h3>
                        </div>
                    )}
                </div>
            )}

            {/* My Courses Tab */}
            {activeTab === 'myCourses' && (
                <div>
                    <h3 style={styles.subHeading}>My Approved Courses</h3>
                    {courses.length > 0 ? (
                        <ul style={styles.courseList}>
                            {courses.map((course) => (
                                <li key={course.courseId} style={styles.courseItem}>
                                    <h4>{course.title}</h4>
                                    <p>{course.description}</p>
                                    <p><strong>Start Date:</strong> {course.startDate}</p>
                                    <p><strong>End Date:</strong> {course.endDate}</p>
                                    <p><strong>Price:</strong> ${course.price}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No courses approved by the admin yet.</p>
                    )}
                </div>
            )}

            {/* Course Reviews Tab */}
            {activeTab === 'reviews' && (
                <div>
                    <h3 style={styles.subHeading}>Course Reviews</h3>
                    {reviews.length > 0 ? (
                        <ul style={styles.courseList}>
                            {reviews.map((review) => (
                                <li key={review.courseId} style={styles.courseItem}>
                                    <h4>Course: {review.courseTitle}</h4>
                                    <p>Students Enrolled: {review.studentCount}</p>
                                    <p>Rating: {review.rating}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        maxWidth: '800px',
        margin: '0 auto',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        fontSize: '24px',
        color: '#333',
    },
    subHeading: {
        fontSize: '20px',
        color: '#555',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    tabs: {
        display: 'flex',
        gap: '10px',
    },
    tab: {
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: '#eee',
        border: '1px solid #ccc',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
    },
    activeTab: {
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
        border: '1px solid #007bff',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
    },
    logoutButton: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    welcomeMessage: {
        fontSize: '18px',
        color: '#666',
    },
    professorInfo: {
        fontSize: '16px',
        color: '#777',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    textarea: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        height: '80px',
    },
    moduleContainer: {
        marginBottom: '15px',
    },
    moduleInput: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '100%',
    },
    moduleTextarea: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '100%',
        height: '80px',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
    },
    addButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    submitButton: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    courseList: {
        listStyleType: 'none',
        padding: '0',
    },
    courseItem: {
        border: '1px solid #ccc',
        padding: '15px',
        marginBottom: '10px',
        borderRadius: '5px',
        backgroundColor: '#fff',
    },
};

export default ProfessorDashboard;
