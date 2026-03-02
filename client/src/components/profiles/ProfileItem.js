import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileItem = ({
    profile: {
        user,
        status,
        company,
        location,
        skills,
    },
}) => {
    const _id = user?._id;
    const name = user?.name;
    const avatar = user?.avatar;

    return (
        <div className="profile bg-light">
            <img 
                src={avatar || 'https://via.placeholder.com/150'} 
                alt={name || 'Profile'} 
                className="round-img" 
            />
            <div>
                <h2>{name || 'Unknown User'}</h2>
                <p>
                    {status || 'Not specified'} {company && <span> at {company}</span>}
                </p>
                {location && (
                    <p className="my-1">
                        <i className="fas fa-map-marker-alt"></i> {location}
                    </p>
                )}
                <Link to={`/profile/${_id}`} className="btn btn-primary">
                    View Profile
                </Link>
            </div>
            <ul>
                {skills && skills.length > 0 ? (
                    skills.slice(0, 4).map((skill, index) => (
                        <li key={index} className="text-primary">
                            <i className="fas fa-check"></i> {skill}
                        </li>
                    ))
                ) : (
                    <li className="text-muted">No skills listed</li>
                )}
            </ul>
        </div>
    );
};

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default ProfileItem;
