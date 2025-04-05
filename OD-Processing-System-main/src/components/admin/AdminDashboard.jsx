import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Alert,
    IconButton,
    Grid,
    Card,
    CardContent,
    Chip,
    Tabs,
    Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { API_ENDPOINTS, getAuthHeaders } from '../../config';

const StatsCard = ({ title, value, color = 'primary' }) => (
    <Card sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(26, 35, 126, 0.1) 100%)',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(26, 35, 126, 0.1)',
        }
    }}>
        <CardContent>
            <Typography variant="h6" color="textSecondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h3" color={`${color}.main`}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        mentor: '',
        cls_advisor: '',
        roll_no: '',
        mentees: '',
        cls_students: '',
        handling_students: ''
    });
    const [editingUser, setEditingUser] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [statistics, setStatistics] = useState({
        overall: { totalRequests: 0, approved: 0, rejected: 0, pending: 0 },
        teacherStats: []
    });
    const [timePeriod, setTimePeriod] = useState('7days');
    const [selectedTeacher, setSelectedTeacher] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState('all');

    useEffect(() => {
        fetchUsers();
        fetchStatistics();
    }, [timePeriod, selectedTeacher, selectedStudent]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.USERS, {
                headers: getAuthHeaders()
            });
            setUsers(response.data.users);
            setTeachers(response.data.users.filter(user => user.role === 'teacher'));
        } catch (error) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', error);
        }
    };

    const fetchStatistics = async () => {
        try {
            setError('');
            
            // Use a try-catch block specifically for the API call
            let response;
            try {
                response = await axios.get(
                    `${API_ENDPOINTS.ADMIN_OD_STATISTICS}?timePeriod=${timePeriod}&teacherId=${selectedTeacher}&studentId=${selectedStudent}`,
                    {
                        headers: getAuthHeaders()
                    }
                );
            } catch (apiError) {
                console.error('API call error:', apiError);
                throw new Error('Failed to fetch statistics from server');
            }
            
            // Create a completely new statistics object with default values
            const defaultStats = {
                overall: { totalRequests: 0, approved: 0, rejected: 0, pending: 0 },
                teacherStats: []
            };
            
            // If no data or invalid data, use defaults
            if (!response || !response.data) {
                setStatistics(defaultStats);
                return;
            }
            
            // Safely extract overall statistics with defaults
            const overall = {
                totalRequests: 0,
                approved: 0,
                rejected: 0,
                pending: 0
            };
            
            // Try to get overall stats, but use defaults if any issues
            try {
                if (response.data.overall) {
                    overall.totalRequests = parseInt(response.data.overall.totalRequests) || 0;
                    overall.approved = parseInt(response.data.overall.approved) || 0;
                    overall.rejected = parseInt(response.data.overall.rejected) || 0;
                    overall.pending = parseInt(response.data.overall.pending) || 0;
                }
            } catch (e) {
                console.error('Error processing overall stats:', e);
                // Keep default values
            }
            
            // Safely process teacher stats
            let teacherStats = [];
            try {
                if (Array.isArray(response.data.teacherStats)) {
                    teacherStats = response.data.teacherStats.map(teacher => {
                        // Create a safe teacher object with defaults
                        const safeTeacher = {
                            teacherId: '',
                            teacherName: '',
                            teacherEmail: '',
                            stats: {
                                totalHandled: 0,
                                approved: 0,
                                rejected: 0,
                                pending: 0
                            }
                        };
                        
                        // Try to safely extract values
                        if (teacher) {
                            // Convert ObjectId to string if it's an object
                            safeTeacher.teacherId = teacher.teacherId ? 
                                (typeof teacher.teacherId === 'object' ? 
                                    teacher.teacherId.toString() : 
                                    String(teacher.teacherId)) : '';
                            
                            safeTeacher.teacherName = teacher.teacherName || '';
                            safeTeacher.teacherEmail = teacher.teacherEmail || '';
                            
                            if (teacher.stats) {
                                safeTeacher.stats.totalHandled = parseInt(teacher.stats.totalHandled) || 0;
                                safeTeacher.stats.approved = parseInt(teacher.stats.approved) || 0;
                                safeTeacher.stats.rejected = parseInt(teacher.stats.rejected) || 0;
                                safeTeacher.stats.pending = parseInt(teacher.stats.pending) || 0;
                            }
                        }
                        
                        return safeTeacher;
                    });
                }
            } catch (e) {
                console.error('Error processing teacher stats:', e);
                // Keep empty array
            }
            
            // Set the safely processed statistics
            setStatistics({
                overall,
                teacherStats
            });
            
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setError(error.message || 'Failed to fetch statistics');
            
            // Set default values when there's an error
            setStatistics({
                overall: { totalRequests: 0, approved: 0, rejected: 0, pending: 0 },
                teacherStats: []
            });
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError('');
        setNewUser({
            name: '',
            email: '',
            password: '',
            role: 'student',
            mentor: '',
            cls_advisor: '',
            roll_no: '',
            mentees: '',
            cls_students: '',
            handling_students: ''
        });
    };

    const convertArrayToString = (arr) => {
        return Array.isArray(arr) ? arr.join(', ') : '';
    };

    const handleEditOpen = (user) => {
        // Convert arrays to comma-separated strings for editing
        const editUser = {
            ...user,
            mentees: convertArrayToString(user.menteeRollNumbers || user.mentees || []),
            cls_students: convertArrayToString(user.classStudentRollNumbers || user.cls_students || []),
            handling_students: convertArrayToString(user.handlingStudentRollNumbers || user.handling_students || [])
        };
        setEditingUser(editUser);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setEditingUser(null);
    };

    const handleChange = (e) => {
        if (editingUser) {
            setEditingUser({
                ...editingUser,
                [e.target.name]: e.target.value
            });
        } else {
            setNewUser({
                ...newUser,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleArrayChange = (e, arrayName) => {
        const value = e.target.value;
        // Allow direct input including commas
        if (editingUser) {
            setEditingUser(prev => ({
                ...prev,
                [arrayName]: value
            }));
        } else {
            setNewUser(prev => ({
                ...prev,
                [arrayName]: value
            }));
        }
    };

    const handleKeyDown = (e) => {
        // Allow comma input
        if (e.key === ',') {
            e.stopPropagation();
        }
    };

    const processArrayBeforeSubmit = (value) => {
        // Process the string into array only when submitting
        return value
            .split(/[,\n]/)
            .map(item => item.trim())
            .filter(item => item !== '');
    };

    const handleCreateUser = async () => {
        try {
            setError('');
            setSuccess('');
            
            // Process the user data
            const processedUser = {
                ...newUser,
                mentees: newUser.mentees ? newUser.mentees.split(',').map(id => id.trim()) : [],
                cls_students: newUser.cls_students ? newUser.cls_students.split(',').map(id => id.trim()) : [],
                handling_students: newUser.handling_students ? newUser.handling_students.split(',').map(id => id.trim()) : []
            };
            
            const response = await axios.post(API_ENDPOINTS.USERS, processedUser, {
                headers: getAuthHeaders()
            });
            
            if (response.data.success) {
                setSuccess('User created successfully');
                handleClose();
                fetchUsers();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleUpdateUser = async () => {
        try {
            setError('');
            setSuccess('');
            
            // Validate required fields for students
            if (editingUser.role === 'student') {
                if (!editingUser.mentor || !editingUser.cls_advisor) {
                    setError('Both mentor and class advisor are required for students');
                    return;
                }
                if (!editingUser.roll_no) {
                    setError('Roll number is required for students');
                    return;
                }
            }
            
            // Process the user data
            const processedUser = {
                ...editingUser,
                mentees: typeof editingUser.mentees === 'string' ? processArrayBeforeSubmit(editingUser.mentees) : (editingUser.mentees || []),
                cls_students: typeof editingUser.cls_students === 'string' ? processArrayBeforeSubmit(editingUser.cls_students) : (editingUser.cls_students || []),
                handling_students: typeof editingUser.handling_students === 'string' ? processArrayBeforeSubmit(editingUser.handling_students) : (editingUser.handling_students || [])
            };
            
            // Remove any undefined or null values
            Object.keys(processedUser).forEach(key => {
                if (processedUser[key] === undefined || processedUser[key] === null) {
                    delete processedUser[key];
                }
            });
            
            console.log('Sending update request with data:', processedUser);
            
            const response = await axios.put(API_ENDPOINTS.USER_BY_ID(editingUser._id), processedUser, {
                headers: getAuthHeaders()
            });
            
            console.log('Update response:', response.data);
            
            if (response.data.message === 'User updated successfully') {
                setSuccess('User updated successfully');
                handleEditClose();
                fetchUsers();
            } else {
                setError('Unexpected response format');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            console.error('Error details:', error.response?.data);
            setError(error.response?.data?.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(API_ENDPOINTS.USER_BY_ID(userId), {
                    headers: getAuthHeaders()
                });
                setSuccess('User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                setError(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Statistics" />
                <Tab label="User Management" />
            </Tabs>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {activeTab === 0 ? (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Time Period</InputLabel>
                                    <Select
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(e.target.value)}
                                        label="Time Period"
                                    >
                                        <MenuItem value="7days">Last 7 Days</MenuItem>
                                        <MenuItem value="30days">Last 30 Days</MenuItem>
                                        <MenuItem value="1year">Last Year</MenuItem>
                                        <MenuItem value="lifetime">Lifetime</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Teacher</InputLabel>
                                    <Select
                                        value={selectedTeacher}
                                        onChange={(e) => setSelectedTeacher(e.target.value)}
                                        label="Teacher"
                                    >
                                        <MenuItem value="all">All Teachers</MenuItem>
                                        {teachers.map((teacher) => (
                                            <MenuItem key={teacher._id} value={teacher._id}>
                                                {teacher.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Student</InputLabel>
                                    <Select
                                        value={selectedStudent}
                                        onChange={(e) => setSelectedStudent(e.target.value)}
                                        label="Student"
                                    >
                                        <MenuItem value="all">All Students</MenuItem>
                                        {users.filter(u => u.role === 'student').map((student) => (
                                            <MenuItem key={student._id} value={student._id}>
                                                {student.name} ({student.roll_no})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    <Typography variant="h5" sx={{ mb: 3 }}>Overall Statistics</Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard 
                                title="Total Requests" 
                                value={statistics.overall.totalRequests} 
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard 
                                title="Approved" 
                                value={statistics.overall.approved} 
                                color="success"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard 
                                title="Rejected" 
                                value={statistics.overall.rejected} 
                                color="error"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatsCard 
                                title="Pending" 
                                value={statistics.overall.pending} 
                                color="warning"
                            />
                        </Grid>
                    </Grid>

                    {selectedTeacher === 'all' && (
                        <>
                            <Typography variant="h5" sx={{ mb: 3 }}>Teacher Statistics</Typography>
                            <TableContainer component={Paper} sx={{ mb: 4 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Teacher Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Total Handled</TableCell>
                                            <TableCell>Approved</TableCell>
                                            <TableCell>Rejected</TableCell>
                                            <TableCell>Pending</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {statistics.teacherStats.map((teacher) => (
                                            <TableRow key={teacher.teacherId}>
                                                <TableCell>{teacher.teacherName}</TableCell>
                                                <TableCell>{teacher.teacherEmail}</TableCell>
                                                <TableCell>{teacher.stats.totalHandled}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={teacher.stats.approved}
                                                        color="success"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={teacher.stats.rejected}
                                                        color="error"
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={teacher.stats.pending}
                                                        color="warning"
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </>
            ) : (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5">
                            User Management
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleOpen}>
                            Add New User
                        </Button>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Mentor</TableCell>
                                    <TableCell>Class Advisor</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            {user.mentor ? 
                                                users.find(u => u._id === user.mentor)?.name || 'Unknown' : 
                                                'Not Assigned'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {user.cls_advisor ? 
                                                users.find(u => u._id === user.cls_advisor)?.name || 'Unknown' : 
                                                'Not Assigned'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditOpen(user)}
                                                sx={{ mr: 1 }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeleteUser(user._id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleCreateUser} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={newUser.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={newUser.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={newUser.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={newUser.role}
                                onChange={handleChange}
                                label="Role"
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>

                        {newUser.role === 'teacher' && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Mentees (comma-separated roll numbers)"
                                    name="mentees"
                                    value={newUser.mentees}
                                    onChange={(e) => handleArrayChange(e, 'mentees')}
                                    onKeyDown={handleKeyDown}
                                    margin="normal"
                                    helperText="Enter student roll numbers separated by commas or new lines"
                                    multiline
                                    rows={2}
                                />
                                <TextField
                                    fullWidth
                                    label="Class Students (comma-separated roll numbers)"
                                    name="cls_students"
                                    value={newUser.cls_students}
                                    onChange={(e) => handleArrayChange(e, 'cls_students')}
                                    onKeyDown={handleKeyDown}
                                    margin="normal"
                                    helperText="Enter student roll numbers separated by commas or new lines"
                                    multiline
                                    rows={2}
                                />
                                <TextField
                                    fullWidth
                                    label="Handling Students (comma-separated roll numbers)"
                                    name="handling_students"
                                    value={newUser.handling_students}
                                    onChange={(e) => handleArrayChange(e, 'handling_students')}
                                    onKeyDown={handleKeyDown}
                                    margin="normal"
                                    helperText="Enter student roll numbers separated by commas or new lines"
                                    multiline
                                    rows={2}
                                />
                            </>
                        )}

                        {newUser.role === 'student' && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Roll Number"
                                    name="roll_no"
                                    value={newUser.roll_no}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                />
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Mentor</InputLabel>
                                    <Select
                                        name="mentor"
                                        value={newUser.mentor}
                                        onChange={handleChange}
                                        label="Mentor"
                                    >
                                        <MenuItem value="">Select Mentor</MenuItem>
                                        {teachers.map((teacher) => (
                                            <MenuItem key={teacher._id} value={teacher._id}>
                                                {teacher.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Class Advisor</InputLabel>
                                    <Select
                                        name="cls_advisor"
                                        value={newUser.cls_advisor}
                                        onChange={handleChange}
                                        label="Class Advisor"
                                    >
                                        <MenuItem value="">Select Class Advisor</MenuItem>
                                        {teachers.map((teacher) => (
                                            <MenuItem key={teacher._id} value={teacher._id}>
                                                {teacher.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateUser} variant="contained" color="primary">
                        Create User
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleUpdateUser} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={editingUser?.name || ''}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={editingUser?.email || ''}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={editingUser?.role || ''}
                                onChange={handleChange}
                                label="Role"
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>

                        {editingUser?.role === 'teacher' && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Mentees (comma-separated roll numbers)"
                                    name="mentees"
                                    value={editingUser.mentees}
                                    onChange={(e) => handleArrayChange(e, 'mentees')}
                                    onKeyDown={handleKeyDown}
                                    margin="normal"
                                    helperText="Enter student roll numbers separated by commas or new lines"
                                    multiline
                                    rows={2}
                                />
                                <TextField
                                    fullWidth
                                    label="Class Students (comma-separated roll numbers)"
                                    name="cls_students"
                                    value={editingUser.cls_students}
                                    onChange={(e) => handleArrayChange(e, 'cls_students')}
                                    onKeyDown={handleKeyDown}
                                    margin="normal"
                                    helperText="Enter student roll numbers separated by commas or new lines"
                                    multiline
                                    rows={2}
                                />
                                <TextField
                                    fullWidth
                                    label="Handling Students (comma-separated roll numbers)"
                                    name="handling_students"
                                    value={editingUser.handling_students}
                                    onChange={(e) => handleArrayChange(e, 'handling_students')}
                                    onKeyDown={handleKeyDown}
                                    margin="normal"
                                    helperText="Enter student roll numbers separated by commas or new lines"
                                    multiline
                                    rows={2}
                                />
                            </>
                        )}

                        {editingUser?.role === 'student' && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Roll Number"
                                    name="roll_no"
                                    value={editingUser.roll_no || ''}
                                    onChange={handleChange}
                                    margin="normal"
                                    required
                                />
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Mentor</InputLabel>
                                    <Select
                                        name="mentor"
                                        value={editingUser?.mentor || ''}
                                        onChange={handleChange}
                                        label="Mentor"
                                    >
                                        <MenuItem value="">Select Mentor</MenuItem>
                                        {teachers.map((teacher) => (
                                            <MenuItem key={teacher._id} value={teacher._id}>
                                                {teacher.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Class Advisor</InputLabel>
                                    <Select
                                        name="cls_advisor"
                                        value={editingUser?.cls_advisor || ''}
                                        onChange={handleChange}
                                        label="Class Advisor"
                                    >
                                        <MenuItem value="">Select Class Advisor</MenuItem>
                                        {teachers.map((teacher) => (
                                            <MenuItem key={teacher._id} value={teacher._id}>
                                                {teacher.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleUpdateUser} variant="contained" color="primary">
                        Update User
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;