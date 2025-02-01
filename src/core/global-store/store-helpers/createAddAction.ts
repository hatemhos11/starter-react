import { AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { removeFileValues } from '@/utils/removeFileValuesFromObj';
import { uploadAttachmentApi } from '@/utils/attachments-upload-utils/attachmentUploadUtils';
import { asyncThunkErrorHelper } from '@/utils/AsyncThunkErrorHelper';
import { apiPost } from '@/lib/axios/axios-utils';
import { TResponse } from '@/types/global.types';
import _ from 'lodash'; // Utility library
import { toast } from '@/lib/toasts/toast';

interface AttachmentPayload {
    file: File;
    attachIdKey: string; // Path to update attachment ID in the payload
    oldAttachId?: string; // Optional ID of the old attachment to be replaced
}

interface AddActionParams<TPayloadAdd> {
    reducerName: string; // Name of the Redux reducer
    endpoint: string; // API endpoint to POST data
    attachmentTypeId?: string; // Attachment type ID
    isQuiz?: boolean; // for handle quiz attachment
    transformDataBeforeUpload?: (data: TPayloadAdd) => TPayloadAdd; // Optional data transformation before upload
    transformResponse?: (response: AxiosResponse<TResponse, any>) => any; // Optional response transformation
}

// Utility to create reusable add actions
export const createAddAction = <TPayloadAdd extends Record<string, any>>({
    reducerName,
    endpoint,
    attachmentTypeId = 'dbf32d5e-a59f-4198-96ec-e4baf7a297c0',
    isQuiz,
    transformDataBeforeUpload,
    transformResponse,
}: AddActionParams<TPayloadAdd>) =>
    createAsyncThunk(
        reducerName,
        async (payload: { data: TPayloadAdd; attachments?: AttachmentPayload[] }, { rejectWithValue }) => {
            try {
                let data = payload.data;
                const attachments = payload?.attachments || [];

                // Transform data before attachment upload (optional)
                if (transformDataBeforeUpload) {
                    data = transformDataBeforeUpload(data);
                }

                // Handle attachments asynchronously
                if (attachments?.length) {
                    toast('جاري رفع الصور');
                }
                for (const attach of attachments || []) {
                    const { file, attachIdKey, oldAttachId } = attach;
                    const { id: attachmentId } = await uploadAttachmentApi({
                        file,
                        attachmentTypeId,
                        oldAttachId,
                        isQuiz,
                    });
                    if (!attachmentId && !isQuiz) {
                        throw new Error('خطأ في رفع الصور');
                    }
                    _.set(data, attachIdKey, attachmentId); // Dynamically set attachment ID in data
                }
                if (attachments?.length) {
                    toast('تم رفع الصور بنجاح', 'success');
                }

                // Remove unnecessary file fields
                const cleanedData = removeFileValues(data);

                // Post the cleaned data to the API
                const response = await apiPost<TResponse>({ endpoint, body: cleanedData });

                // Transform response (optional)
                return transformResponse ? transformResponse(response) : response;
            } catch (error: unknown) {
                return asyncThunkErrorHelper(error, rejectWithValue);
            }
        },
    );
