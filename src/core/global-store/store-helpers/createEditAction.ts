import { createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { apiPut } from '@/lib/axios/axios-utils';
import { asyncThunkErrorHelper } from '@/utils/AsyncThunkErrorHelper';
import { uploadAttachmentApi } from '@/utils/attachments-upload-utils/attachmentUploadUtils';
import { removeFileValues } from '@/utils/removeFileValuesFromObj';
import { AxiosResponse } from 'axios';
import { TResponse } from '@/types/global.types';
import { toast } from '@/lib/toasts/toast';

interface AttachmentPayload {
    file: File;
    attachIdKey: string; // Path to update attachment ID in the payload
    oldAttachId?: string; // Optional ID of the old attachment to be replaced
}

export interface CreateEditActionParams<TPayloadAdd extends Record<string, any>> {
    reducerName: string; // Name of the Redux reducer
    url: string | ((payload: any) => string); // Function to generate edit endpoint based on ID
    attachmentTypeId?: string; // Attachment type ID
    isQuiz?: boolean; // for handle quiz attachment
    transformDataBeforeUpload?: (data: TPayloadAdd) => TPayloadAdd; // Optional data transformation before upload
    transformResponse?: (response: AxiosResponse<TResponse, any>) => any; // Optional response transformation
}

export const createEditAction = <TPayloadAdd extends Record<string, any>>({
    reducerName,
    url,
    attachmentTypeId = 'dbf32d5e-a59f-4198-96ec-e4baf7a297c0',
    isQuiz,
    transformDataBeforeUpload,
    transformResponse,
}: CreateEditActionParams<TPayloadAdd>) =>
    createAsyncThunk(
        reducerName,
        async (
            payload: {
                id: string;
                data: TPayloadAdd & { id?: string }; // Include `id` to differentiate between create and edit
                attachments: AttachmentPayload[];
            },
            { rejectWithValue },
        ) => {
            try {
                let data = payload.data;
                const attachments = payload.attachments;
                const endpoint = typeof url === 'string' ? url : url(payload);

                // Transform data before attachment upload (optional)
                if (transformDataBeforeUpload) {
                    data = transformDataBeforeUpload(data);
                }
                const isExistNewFiles = attachments?.findIndex((x) => x.file) !== -1 && attachments?.length;
                // Handle attachments asynchronously
                if (isExistNewFiles) {
                    toast('جاري رفع الصور', '');
                }
                for (const attach of attachments || []) {
                    const { file, attachIdKey, oldAttachId } = attach;

                    const { id: attachmentId } = await uploadAttachmentApi({
                        file,
                        attachmentTypeId,
                        oldAttachId,
                        isQuiz,
                    });
                    // if (!attachmentId) {
                    //     throw new Error('خطأ في رفع الصور');
                    // }
                    // Set the attachment ID in the data object dynamically
                    _.set(data, attachIdKey, attachmentId);
                }
                if (isExistNewFiles) {
                    toast('تم رفع الصور بنجاح', 'success');
                }

                // Remove unnecessary file fields
                const cleanedData = removeFileValues(data);

                // Determine if this is a create or edit operation
                const response = await apiPut<TResponse>({
                    endpoint,
                    body: cleanedData,
                });

                // Transform response (optional)
                return transformResponse ? transformResponse(response) : response;
            } catch (error: unknown) {
                return asyncThunkErrorHelper(error, rejectWithValue);
            }
        },
    );
