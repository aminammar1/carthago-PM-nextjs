'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { assets } from '@/app/assets/assets'
import {
  ChevronsRight,
  Ellipsis,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  MessageSquare,
  Plus,
  Users,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDeleteProjectMutation, useGetProjectsQuery } from '@/state/api'
import { useAppDispatch, useAppSelector } from '@/app/redux'
import {
  toggleModal,
  toggleSidebarClose,
  toggleSidebarOpen,
} from '@/state/globalSlice'

const Sidebar = () => {
  const { data: projects } = useGetProjectsQuery()
  const dispatch = useAppDispatch()
  const isSidebarOpen = useAppSelector((state) => state.global.isSidebarOpen)
  return (
    <div
      className={`${
        isSidebarOpen ? 'w-60' : 'w-16'
      } transition-all duration-300 fixed h-full bg-white  flex flex-col gap-y-4 justify-start items-center overflow-x-auto border-r border-[#DBDBDB]`}
    >
      {/* TOP LOGO */}
      <div
        className={`w-full h-16 flex  items-center border-b border-[#DBDBDB] px-4 ${
          isSidebarOpen ? 'justify-between' : 'justify-center'
        }`}
      >
        {isSidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="white" />
                <path
                  d="M6 10.5L9 13.5L14 8.5"
                  stroke="#fb923c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-orange-600 font-extrabold text-xl tracking-tight">
              chartagoPM
            </span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="10" fill="white" />
              <path
                d="M6 10.5L9 13.5L14 8.5"
                stroke="#fb923c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        <div
          className={`text-gray-500 cursor-pointer transform transition-transform duration-300 ${
            isSidebarOpen ? 'rotate-180' : ''
          }`}
          onClick={() =>
            dispatch(isSidebarOpen ? toggleSidebarClose() : toggleSidebarOpen())
          }
        >
          <ChevronsRight size={25} />
        </div>
      </div>

      {/* MENU ITEMS */}
      <nav className="w-full flex flex-col gap-y-2 px-4 border-b border-[#DBDBDB] pb-4">
        <SidebarItem
          title="Home"
          href="/dashboard"
          Icon={LayoutDashboard}
          isSidebarOpen={isSidebarOpen}
        />
        <SidebarItem
          title="Messages"
          href="/messages"
          Icon={MessageSquare}
          isSidebarOpen={isSidebarOpen}
        />
        <SidebarItem
          title="Members"
          href="/members"
          Icon={Users}
          isSidebarOpen={isSidebarOpen}
        />
        <SidebarItem
          title="Tasks"
          href="/tasks"
          Icon={ListChecks}
          isSidebarOpen={isSidebarOpen}
        />
        <SidebarItem
          title="Settings"
          href="/settings"
          Icon={Clock}
          isSidebarOpen={isSidebarOpen}
        />
      </nav>

      {/* Projects List */}
      <div className="w-full flex flex-col gap-y-2 px-4">
        <div
          className={`flex ${
            isSidebarOpen ? 'justify-between' : 'justify-center'
          } items-center `}
        >
          {isSidebarOpen && (
            <p className="text-sm font-medium text-gray-500">MY PROJECTS</p>
          )}
          <button
            className="rounded-sm p-1 border-1 border-gray-500 flex items-center justify-center cursor-pointer hover:bg-orange-100 hover:text-orange-900"
            onClick={() => dispatch(toggleModal())}
          >
            <Plus size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* PROJECTS LIST items*/}
      <div className="w-full flex flex-col gap-y-2 px-4">
        {projects?.map((project) => (
          <ProjectItem
            key={project.id}
            title={project.name}
            href={`/projects/${project.id}`}
            projectId={project.id.toString()}
            isSidebarOpen={isSidebarOpen}
            color="bg-green-400"
          />
        ))}
      </div>
    </div>
  )
}

interface SidebarItemProps {
  title: string
  href: string
  Icon: LucideIcon
  isSidebarOpen: boolean
}

const SidebarItem = ({
  title,
  Icon,
  href,
  isSidebarOpen,
}: SidebarItemProps) => {
  const pathname = usePathname()
  const isActive =
    pathname === href || (pathname === '/' && href === '/dashboard')
  return (
    <Link href={href}>
      <div
        className={`flex gap-4 items-center w-full p-2 rounded-lg cursor-pointer transition-all duration-100
          ${isSidebarOpen ? 'justify-start' : 'justify-center'}
          ${
            isActive
              ? 'bg-orange-100 text-orange-600 font-bold shadow-sm'
              : 'text-gray-700'
          }
          hover:bg-orange-50 hover:text-orange-600 hover:font-semibold`}
      >
        <Icon
          size={20}
          className={`${
            isActive ? 'text-orange-600' : 'text-gray-400'
          } transition-colors`}
        />
        {isSidebarOpen && <p className="text-md font-medium ">{title}</p>}
      </div>
    </Link>
  )
}
interface ProjectItemProps {
  title: string
  href: string
  color: string
  projectId: string
  isSidebarOpen: boolean
}
const ProjectItem = ({
  title,
  href,
  color,
  projectId,
  isSidebarOpen,
}: ProjectItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === href
  const [isProjectOptionsOpen, setIsProjectOptionsOpen] = useState(false)
  const [deleteProject] = useDeleteProjectMutation()
  return (
    <Link href={href}>
      <div
        className={`relative flex  items-center  w-full hover:bg-orange-50 hover:text-orange-600 hover:font-semibold rounded-md p-2 cursor-pointer ${
          isActive ? 'bg-orange-50 text-orange-600 font-semibold' : ''
        }`}
      >
        <div
          className={`flex items-center gap-x-4 w-full ${
            isSidebarOpen ? 'justify-between' : 'justify-center'
          }`}
        >
          <div className={`block w-2 h-2 rounded-full ${color}`}></div>
          {isSidebarOpen && (
            <>
              <p
                className={`text-sm font-medium text-gray-500 truncate line-clamp-1 flex-1 w-40 ${
                  isActive ? 'text-primary-600' : ''
                }`}
              >
                {title}
              </p>
              <Ellipsis
                size={20}
                className={`text-gray-500  ${
                  isActive ? 'text-primary-600' : ''
                }`}
                onClick={() => setIsProjectOptionsOpen(!isProjectOptionsOpen)}
              />
            </>
          )}
        </div>
        {isProjectOptionsOpen && isSidebarOpen && isActive && (
          <div className=" z-50 absolute  top-7 right-0 w-2/3 p-1 bg-white rounded-md shadow-md flex flex-col gap-y-1">
            <p
              className="text-sm cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-300 hover:bg-opacity-40 rounded-md px-2 py-1 w-full"
              onClick={() => deleteProject({ projectId: projectId })}
            >
              Delete
            </p>
            <p className="text-sm  text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md px-2 py-1 cursor-pointer">
              Open
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
export default Sidebar
