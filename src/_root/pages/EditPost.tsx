import PostForm from '@/components/forms/PostForm'
import { useGetPostById } from '@/lib/react-query/queriesAndMutations'
import EditLoader from '../../components/Shared/Loaders/EditLoader'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserContext } from '@/context/AuthContext'
import { useEffect } from 'react'

const EditPost = () => {

  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();

  useEffect(() => {
    const verifyAuth = async () => {
      const isValid = await checkAuthUser();
      if (!isValid) {
        navigate("/sign-in");
      }
    };

    verifyAuth();
  }, [checkAuthUser, navigate]);

  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || '')
  if (isPending) return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <EditLoader />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-1">
      <div className='common-container'>
        <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
          <img
            src='/assets/icons/edit.svg'
            alt='add'
            width={36}
            height={36}
          />
          <h2 className='h3-bold md:h2-bold text-left w-full'>
            Edit Post
          </h2>
        </div>
        <PostForm action='Update' post={post} />
      </div>
    </div>
  )
}

export default EditPost