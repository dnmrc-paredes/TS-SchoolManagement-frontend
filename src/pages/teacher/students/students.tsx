import {FC, useEffect, useState, useCallback} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

// Interfaces
import { Istate } from '../../../interfaces/state'
import { IuserInfo } from '../../../interfaces/userInfo'

export const TeacherStudentPage: FC = () => {

    const userID = useSelector((state: Istate) => state.user.user._id)
    const [user, setUser] = useState<IuserInfo>({})

    const getOneUser = useCallback( async () => {

        try {

            const {data} = await axios.post<{data: {oneUser: IuserInfo}}>('http://localhost:8000/graphql', {
                query: `query oneUser($userID: ID!) {
                    oneUser(userID: $userID) {
                        _id
                        firstName
                        middleName
                        lastName
                        instructorsSubjects {
                            _id
                            name
                            description
                            studentsWhoTake {
                                _id
                                firstName
                                middleName
                                lastName
                            }
                        }
                    }
                }`,
                variables: {
                    userID
                }
            })

            if (data.data.oneUser) {
                setUser(data.data.oneUser)
            }
            
        } catch (err) {
            console.log(err)
        }

    },[userID])

    useEffect(() => {
        getOneUser()
    },[getOneUser])


    return (
        <div>
            <h1 style={{textAlign: 'center', padding: '2rem 0rem'}} > My Subjects </h1>
            {user.instructorsSubjects?.map(item => {
                return <div key={item._id} className="inssubs" >
                    <h1 style={{marginBottom: '0.5rem'}} > {item.name} </h1>
                    {item.studentsWhoTake?.length === 0 ? <h2> No students take </h2> : 
                    item.studentsWhoTake?.map(student => {
                        return <li key={student._id} > {student.firstName} {student.lastName} </li>
                    })}
                </div>
            })}
        </div>
    )

}