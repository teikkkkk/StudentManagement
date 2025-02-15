'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Controller, useForm } from 'react-hook-form';
import styles from "../styles/EditCourse.module.css";
import { FaHome } from "react-icons/fa";
import { toast } from 'react-hot-toast';

interface Course {
    id?: number;
    name: string;
    price: number;
    schedule: {
        type: 'weekly' | 'custom';
        time: {
            start: string;
            end: string;
        };
        days?: string[];
        schedule_data?: string[];
    };
    start_date: string;
    end_date: string;
    teacher_id: number;
    detail?: string;
    max_students?: number;
    status?: string;
    image?: FileList;
    video_url?: string;
}

interface Teacher {
    id: number;
    name: string;
}

 
const DAYS_OF_WEEK = [
    { value: 'monday', label: 'Thứ 2' },
    { value: 'tuesday', label: 'Thứ 3' },
    { value: 'wednesday', label: 'Thứ 4' },
    { value: 'thursday', label: 'Thứ 5' },
    { value: 'friday', label: 'Thứ 6' },
    { value: 'saturday', label: 'Thứ 7' },
    { value: 'sunday', label: 'Chủ nhật' },
];

export default function EditCourse() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams?.get('courseId');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm<Course>({
        defaultValues: {
          name: '',
            price: 0,
            max_students: 0,
            schedule: {
                type: 'weekly',
                time: {
                    start: '',
                    end: ''
                },
                days: []
            }
        }
    });
    const scheduleType = watch('schedule.type');
    const start_date = watch('start_date');

    useEffect(() => {
        if (!courseId) return;
        fetchTeachers();
        fetchCourseDetails();
    }, [courseId]);

    const fetchTeachers = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teachers`);
            if (!response.ok) throw new Error('Không thể lấy danh sách giáo viên');
            const result = await response.json();
            setTeachers(result.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách giáo viên:', error);
        }
    };

    const fetchCourseDetails = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`);
            if (!response.ok) throw new Error('Không thể lấy thông tin khóa học');
            const data = await response.json();

            if (!data.course) {
                throw new Error('Dữ liệu khóa học không có sẵn');
            }

            const courseData = {
                ...data.course,
                name: data.course.name,
                price: parseFloat(data.course.price),
                start_date: data.course.start_date ? data.course.start_date.split('T')[0] : '',
                end_date: data.course.end_date ? data.course.end_date.split('T')[0] : '',
                schedule: {
                    type: data.course.schedule ?.type || 'weekly',
                    time: {
                        start: data.course.schedule?.start_time?.substring(11, 16) || '',
                        end: data.course.schedule?.end_time?.substring(11, 16) || '',
                    },
                    days: data.course.schedule?.type === 'weekly' ? data.course.schedule.schedule_data || [] : [],
                  
                }
            };

            reset(courseData);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin khóa học:', error);
            toast.error('Lỗi khi lấy thông tin khóa học');
        } finally {
            setIsLoading(false);
        }
    };
   
    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                <span>Đang tải...</span>
            </div>
        );
    }
    const onSubmit = async (data:  Course) => {
      setIsSubmitting(true);
      console.log(data);
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price.toString());
        formData.append('start_date', data.start_date);
        formData.append('end_date', data.end_date);
        formData.append('teacher_id', data.teacher_id.toString());
        if (data.detail) formData.append('detail', data.detail);
        if (data.max_students) formData.append('max_students', data.max_students.toString());
        if (data.image && data.image[0]) formData.append('image', data.image[0]);
        if (data.video_url) formData.append('video_url', data.video_url);
    
        // Add schedule data
        formData.append('schedule[type]', data.schedule.type);
        formData.append('schedule[time][start]', data.schedule.time.start);
        formData.append('schedule[time][end]', data.schedule.time.end);
        if (data.schedule.days) {
          data.schedule.days.forEach((day: string, index: number) => {
            formData.append(`schedule[days][${index}]`, day);
          });
        }
       
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
          method: 'POST',
          body: formData,
        });
        console.log(formData);
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData);
          return;
        }
        await response.json();
        toast.success('Tạo khóa học thành công!');
        router.push('/ListCourse');
        router.refresh();
      } catch (error) {
        console.error('Error:', error);
        toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo khóa học');
      } finally {
        setIsSubmitting(false);
      }
    };
    const handleHomeClick = () => {
        router.push('/Home');
    };
    return (
      <div className={styles.container}>
      <header className={styles.header}>
            <button onClick={handleHomeClick} className={styles.homeButton}>
              <FaHome size={20} />
            </button>
            <h1 className={styles.pageTitle}>Edit Course</h1>
          </header>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>
            Tên khóa học <span className={styles.required}>*</span>
          </label>
          <input
            {...register('name', { 
              required: 'Vui lòng nhập tên khóa học',
              maxLength: {
                value: 255,
                message: 'Tên khóa học không được quá 255 ký tự'
              }
            })}
            className={styles.input}
            placeholder="Nhập tên khóa học"
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name.message}</span>
          )}
        </div>
    
            {/* Giá khóa học */}
            <div className={styles.field}>
              <label className={styles.label}>
                Giá khóa học (VNĐ) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                {...register('price', { 
                  required: 'Vui lòng nhập giá khóa học',
                  min: {
                    value: 0,
                    message: 'Giá không được âm'
                  }
                })}
                className={styles.input}
                placeholder="0"
              />
              {errors.price && (
                <span className={styles.errorMessage}>{errors.price.message}</span>
              )}
            </div>
    
            {/* Thời gian khóa học */}
            <div className={styles.gridCols2}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Ngày bắt đầu <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  {...register('start_date')}
                  className={styles.input}
                />
                {errors.start_date && (
                  <span className={styles.errorMessage}>{errors.start_date.message}</span>
                )}
              </div>
    
              <div className={styles.field}>
                <label className={styles.label}>
                  Ngày kết thúc <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  {...register('end_date', { 
                    required: 'Vui lòng chọn ngày kết thúc',
                    validate: value => 
                      !start_date || new Date(value) > new Date(start_date) || 
                      'Ngày kết thúc phải sau ngày bắt đầu'
                  })}
                  className={styles.input}
                />
                {errors.end_date && (
                    <span className={styles.errorMessage}>{errors.end_date.message}</span>
                )}
              </div>
            </div>
    
            <div className="space-y-4">
              <div className={styles.field}>
                  <label className={styles.label}>
                  Loại lịch học <span className={styles.required}>*</span>
                </label>
                <select
                  {...register('schedule.type')}
                  className={styles.input}
                >
                  <option value="weekly">Hàng tuần</option>
                  <option value="custom">Tùy chỉnh</option>
                </select>
              </div>
    
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={styles.label}>
                    Giờ bắt đầu <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="time"
                    {...register('schedule.time.start', {
                      required: 'Vui lòng chọn giờ bắt đầu'
                    })}
                      className={styles.input}
                  />
                </div>
                <div>
                  <label className={styles.label}>
                    Giờ kết thúc <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="time"
                    {...register('schedule.time.end', {
                      required: 'Vui lòng chọn giờ kết thúc'
                    })}
                    className={styles.input}
                  />
                </div>
              </div>
    
              {scheduleType === 'weekly' && (
                <div>
                  <label className={styles.label}>
                  Ngày học trong tuần <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.gridCols2}>
                    <Controller
                      name="schedule.days"
                      control={control}
                      rules={{ required: 'Vui lòng chọn ít nhất một ngày' }}
                      render={({ field }) => (
                        <>
                          {DAYS_OF_WEEK.map((day) => (
                            <label key={day.value} className={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                value={day.value}
                                checked={field.value?.includes(day.value)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const value = e.target.value;
                                  const currentValues = field.value || [];
                                  field.onChange(
                                    checked
                                      ? [...currentValues, value]
                                      : currentValues.filter((v) => v !== value)
                                  );
                                }}
                                className={styles.checkbox}
                              />
                              <span>{day.label}</span>
                            </label>
                          ))}
                        </>
                      )}
                    />
                  </div>
                  {errors.schedule?.days && (
                    <span className={styles.errorMessage}>
                      {errors.schedule.days.message}
                    </span>
                  )}
                </div>
              )}
    
              
            </div>
    
            {/*  Giáo viên */}
            <div>
              <label className={styles.label}>
                Giáo viên <span className={styles.required}>*</span>
              </label>
              <select
                {...register('teacher_id', { 
                  required: 'Vui lòng chọn giáo viên'
                })}
                className={styles.input}
              >
                <option value="">Chọn giáo viên</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={String(teacher.id)}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {errors.teacher_id && (
                <span className={styles.errorMessage}>{errors.teacher_id.message}</span>
              )}
            </div>
    
            {/* Số học viên tối đa */}
            <div>
              <label className={styles.label}>
                Số học viên tối đa
              </label>
              <input
                type="number"
                {...register('max_students', { 
                  min: {
                    value: 0,
                    message: 'Số học viên không được âm'
                  }
                })}
                className={styles.input}
                placeholder="0 (không giới hạn)"
              />
              {errors.max_students && (
                <span className={styles.errorMessage}>{errors.max_students.message}</span>
              )}
            </div>
    
            {/* Chi tiết khóa học */}
            <div>
              <label className={styles.label}>
                Chi tiết khóa học
              </label>
              <textarea
                {...register('detail')}
                rows={4}
                className={styles.input}
                placeholder="Nhập chi tiết về khóa học..."
              />
            </div>
     
    
            {/* Ảnh khóa học */}
            <div className={styles.field}>
              <label className={styles.label}>
                Ảnh khóa học
              </label>
              <input
              type="file"
              accept="image/*"
                
                className={styles.input}
              />
              {errors.image && (
                <span className={styles.errorMessage}>{errors.image.message}</span>
              )}
            </div>
        <div className={styles.field}>
          <label className={styles.label}>
            Video<span className={styles.required}>*</span>
          </label>
          <input
            {...register('video_url', { 
              maxLength: {
                value: 255,
                message: 'Tên khóa học không được quá 255 ký tự'
              }
            })}
            className={styles.input}
            
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name.message}</span>
          )}
        </div>
    
            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => router.back()}
                className={styles.cancelButton}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Cập nhật khóa học'}
              </button>
            </div>
          </form>
        </div>
      );
    }