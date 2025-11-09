'use client'

import { useStore } from '@/components/context/ClientProvider'
import Loader from '@/components/Loader'
import Select from '@/components/Select'
import { TableContent, TableHead } from '@/components/TinyComponents'
import { USER } from '@/data/api'
import { useRequest } from '@/hooks/useRequest'
import { Trash, UserAdd, UserMinus } from 'iconsax-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import '../../../../../i18n'

export default function AdminUsers() {
  const { store } = useStore()
  const { t } = useTranslation()

  const [usersReq, usersLoader] = useRequest({
    url: USER,
    method: 'GET',
  })

  const [userDeleteReq, userDeleteLoader] = useRequest({
    url: USER,
    method: 'DELETE',
  })

  const [users, setUsers] = useState([])

  const getUsers = () => {
    usersReq()
      .then((r) => setUsers(r))
      .catch(() => {
        toast.error(t('There is an error getting users.'))
      })
  }

  useEffect(() => {
    getUsers()
  }, [])

  const [makeAdminReq, makeAdminLoader] = useRequest({
    url: USER + '/make-admin',
    method: 'POST',
  })

  const [setUserPlanReq, setUserPlanLoader] = useRequest({
    url: USER + '/set-plan',
    method: 'POST',
  })

  const makeAdmin = (id) => {
    makeAdminReq({ id })
      .then(() => {
        toast.success(t('Operation was successful'))
        getUsers()
      })
      .catch(() => {
        toast.error(t('There was an error'))
      })
  }

  const setUserPlan = (id, plan) => {
    setUserPlanReq({ id, plan })
      .then(() => {
        toast.success(t('Operation was successful'))
        getUsers()
      })
      .catch(() => {
        toast.error(t('There was an error'))
      })
  }

  const subRoles = [
    { name: 'Free', value: 'free' },
    { name: 'Premium', value: 'premium' },
    { name: 'Banned', value: 'banned' },
  ]

  const userDeleteHandle = (id) => {
    userDeleteReq({ id })
      .then(() => {
        toast.success(t('Operation was successful'))
        getUsers()
      })
      .catch(() => {
        toast.error(t('There was an error'))
      })
  }
  return (
    <div className="bg-backgroundDark p-4">
      <h1 className="text-lg font-semibold text-text">{t('Manage Users')}</h1>
      <div className="overflow-auto">
        <div className="grid grid-cols-6 mt-8 min-w-[1000px]">
          <TableHead>{t('Name')}</TableHead>
          <TableHead>{t('Email')}</TableHead>
          <TableHead>{t('Join Date')}</TableHead>
          <TableHead>{t('Plan / Role')}</TableHead>
          <TableHead>{t('Plan Start Date')}</TableHead>
          <TableHead>{t('Options')}</TableHead>
          {usersLoader ? (
            <div className="col-span-6">
              <Loader size={30} />
            </div>
          ) : (
            users
              .filter((user) =>
                store.user.role === 'super-admin'
                  ? user.role !== 'super-admin'
                  : user.role !== 'super-admin' && user.role !== 'admin'
              )
              .map((user, index) => (
                <React.Fragment key={index}>
                  <TableContent>
                    {user.firstName} {user.lastName}
                  </TableContent>
                  <TableContent>{user.email}</TableContent>
                  <TableContent>
                    {moment(user.createdAt).format('YYYY/MM/DD')}
                  </TableContent>
                  <TableContent>
                    {user.role === 'admin' ? t('Admin') : user.plan}
                  </TableContent>
                  <TableContent>
                    {moment(user.createdAt).format('YYYY/MM/DD')}
                  </TableContent>
                  <TableContent>
                    <div className="flex gap-2 items-center">
                      <Select
                        className="min-w-[100px] scale-75"
                        options={subRoles}
                        noSearch
                        selected={subRoles.find(
                          (item) => item.value === user.plan
                        )}
                        disabled={user.role === 'admin' || setUserPlanLoader}
                        onChange={(e) => setUserPlan(user.id, e.value)}
                      />
                      {store.user.role === 'super-admin' && (
                        <button
                          onClick={() => makeAdmin(user.id)}
                          title={
                            user.role === 'admin'
                              ? t('Remove Admin')
                              : t('Make Admin')
                          }
                        >
                          {user.role === 'admin' ? (
                            <UserAdd size={20} color="green" />
                          ) : (
                            <UserMinus size={20} color="var(--text)" />
                          )}
                        </button>
                      )}
                      <button onClick={() => userDeleteHandle(user.id)}>
                        <Trash size={20} className="text-red-700" color="red" />
                      </button>
                    </div>
                  </TableContent>
                </React.Fragment>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
