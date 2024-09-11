const FollowersList = () => {
  const dispatch = useDispatch();
  const followers = useSelector((state) => state.user.followers);

  useEffect(() => {
    dispatch(getFollowers());
  }, [dispatch]);

  return (
    <div className="followers-list">
      {followers.map((follower) => (
        <div key={follower._id}>
          <img src={follower.profileImage} alt={follower.name} />
          <p>{follower.name}</p>
        </div>
      ))}
    </div>
  );
};
